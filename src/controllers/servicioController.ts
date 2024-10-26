import { Request, Response } from 'express';
import pool from '../database';

class ServicioController {
  public async list(req: Request, res: Response): Promise<void> {
    const { idUser } = req.params;

    try {
      const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);

      if (usuario.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const { Rol, CodigoAdmin } = usuario[0];

      let query: string;
      let params: any[];

      if (Rol === 'admin') {
        query = `
          SELECT S.*, CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompleto
          FROM Servicio S
          INNER JOIN Usuario U ON S.IdUsuario = U.IdUsuario
          WHERE U.CodigoAdmin = ?
        `;
        params = [CodigoAdmin];
      } else {
        query = `
          SELECT S.*, CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompleto
          FROM Servicio S
          INNER JOIN Usuario U ON S.IdUsuario = U.IdUsuario
          WHERE S.IdUsuario = ?
        `;
        params = [idUser];
      }

      const servicios = await pool.query(query, params);
      res.json({ servicios });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener los servicios' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { idUser } = req.params;
    const servicio = req.body;
    servicio.IdUsuario = idUser;

    try {
      await pool.query('INSERT INTO Servicio SET ?', [servicio]);
      res.json({ message: 'Servicio guardado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear el servicio' });
    }
  }

  public async delete(req: Request, res: Response): Promise<void> {
    const { id, idUser } = req.params;

    try {
      const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);

      if (usuario.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const { Rol, CodigoAdmin } = usuario[0];

      let result;
      if (Rol === 'admin') {
        result = await pool.query('DELETE FROM Servicio WHERE IdServicio = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Servicio.IdUsuario AND CodigoAdmin = ?)', [id, CodigoAdmin]);
      } else {
        result = await pool.query('DELETE FROM Servicio WHERE IdServicio = ? AND IdUsuario = ?', [id, idUser]);
      }

      if (result.affectedRows > 0) {
        res.json({ message: 'Servicio eliminado' });
      } else {
        res.status(404).json({ error: 'Servicio no encontrado o el usuario no coincide' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar el servicio' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id, idUser } = req.params;
    const servicio = req.body;

    try {
      const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);

      if (usuario.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const { Rol, CodigoAdmin } = usuario[0];

      let result;
      if (Rol === 'admin') {
        result = await pool.query('UPDATE Servicio SET ? WHERE IdServicio = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Servicio.IdUsuario AND CodigoAdmin = ?)', [servicio, id, CodigoAdmin]);
      } else {
        result = await pool.query('UPDATE Servicio SET ? WHERE IdServicio = ? AND IdUsuario = ?', [servicio, id, idUser]);
      }

      if (result.affectedRows > 0) {
        res.json({ message: 'Servicio actualizado' });
      } else {
        res.status(404).json({ error: 'Servicio no encontrado o el usuario no coincide' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar el servicio' });
    }
  }

  public async getOne(req: Request, res: Response): Promise<void> {
    const { id, idUser } = req.params;

    try {
      const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);

      if (usuario.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const { Rol, CodigoAdmin } = usuario[0];

      let query;
      let params;

      if (Rol === 'admin') {
        query = `
          SELECT * FROM Servicio WHERE IdServicio = ? AND EXISTS (
            SELECT 1 FROM Usuario WHERE IdUsuario = Servicio.IdUsuario AND CodigoAdmin = ?
          )
        `;
        params = [id, CodigoAdmin];
      } else {
        query = 'SELECT * FROM Servicio WHERE IdServicio = ? AND IdUsuario = ?';
        params = [id, idUser];
      }

      const servicio = await pool.query(query, params);

      if (servicio.length > 0) {
        servicio[0].FechaServicio = servicio[0].FechaServicio.toISOString().split('T')[0];
        res.json(servicio[0]);
      } else {
        res.status(404).json({ error: 'El servicio no existe o no tiene acceso' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener el servicio' });
    }
  }
}

export const servicioController = new ServicioController();
export default servicioController;
