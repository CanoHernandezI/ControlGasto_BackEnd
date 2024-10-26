import { Request, Response } from 'express';
import pool from '../database'; 
import axios from 'axios';

const mapboxToken = 'pk.eyJ1IjoiaXNhYWNjYW5vaCIsImEiOiJjbTF1MW40djEwOG91MmlvbDVvM2pudDNkIn0.HwWvhLZXDgZCW4Sa3WDYmA'; 

class UbicacionController {
  // Iniciar una nueva ruta
  public async iniciarRuta(req: Request, res: Response): Promise<void> {
    const { idUsuario } = req.body;

    try {
      const result = await pool.query('INSERT INTO Ruta (IdUsuario, FechaInicio) VALUES (?, NOW())', [idUsuario]);
      const idRuta = result.insertId;
      res.json({ idRuta, message: 'Ruta iniciada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al iniciar la ruta' });
    }
  }

  // Guardar ubicación con el IdRuta
  public async guardarUbicacion(req: Request, res: Response): Promise<void> {
    const { idUsuario, idRuta, latitud, longitud, horaEntrada } = req.body;

    try {
      const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${longitud},${latitud}.json?access_token=${mapboxToken}`;
      const response = await axios.get(url);
      const direccion = response.data.features[0]?.place_name || 'Dirección no encontrada';

      await pool.query(
        'INSERT INTO Ubicacion (IdUsuario, IdRuta, Latitud, Longitud, Direccion, HoraEntrada) VALUES (?, ?, ?, ?, ?, ?)', 
        [idUsuario, idRuta, latitud, longitud, direccion, horaEntrada]
      );

      res.json({ message: 'Ubicación guardada con éxito' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al guardar la ubicación' });
    }
  }

  // Actualizar hora de salida en la ubicación
  public async actualizarHoraSalida(req: Request, res: Response): Promise<void> {
    const { idUbicacion, horaSalida } = req.body;

    try {
      await pool.query('UPDATE Ubicacion SET HoraSalida = ? WHERE IdUbicacion = ?', [horaSalida, idUbicacion]);
      res.json({ message: 'Hora de salida actualizada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al actualizar la hora de salida' });
    }
  }

  // Finalizar la ruta
  public async finalizarRuta(req: Request, res: Response): Promise<void> {
    const { idRuta } = req.body;

    try {
      await pool.query('UPDATE Ruta SET FechaFin = NOW() WHERE IdRuta = ?', [idRuta]);
      res.json({ message: 'Ruta finalizada' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al finalizar la ruta' });
    }
  }

  // Obtener todas las rutas de un usuario con tiempos de permanencia
  public async obtenerRutas(req: Request, res: Response): Promise<void> {
    const { idUsuario } = req.params;

    try {
      const rutas = await pool.query('SELECT * FROM Ruta WHERE IdUsuario = ?', [idUsuario]);
      const rutasConUbicaciones = [];

      for (const ruta of rutas) {
        const ubicaciones = await pool.query(
          'SELECT * FROM Ubicacion WHERE IdRuta = ? ORDER BY HoraEntrada', 
          [ruta.IdRuta]
        );

        const ubicacionesConTiempo = ubicaciones.map((ubicacion: any) => {
          const horaEntrada = new Date(ubicacion.HoraEntrada);
          const horaSalida = ubicacion.HoraSalida ? new Date(ubicacion.HoraSalida) : null;
          const tiempoPermanencia = horaSalida ? (horaSalida.getTime() - horaEntrada.getTime()) / (1000 * 60) : null; // Tiempo en minutos

          return {
            ...ubicacion,
            tiempoPermanencia: tiempoPermanencia ? `${tiempoPermanencia.toFixed(2)} minutos` : 'En el lugar'
          };
        });

        rutasConUbicaciones.push({ ...ruta, ubicaciones: ubicacionesConTiempo });
      }

      res.json(rutasConUbicaciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error al obtener las rutas' });
    }
  }
}

export const ubicacionController = new UbicacionController();
