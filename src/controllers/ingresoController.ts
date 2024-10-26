import { Request, Response } from 'express';
import pool from '../database';

class IngresoController {
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
          SELECT I.*, CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompleto
          FROM Ingreso I 
          INNER JOIN Usuario U ON I.IdUsuario = U.IdUsuario 
          WHERE U.CodigoAdmin = ?
        `;
        params = [CodigoAdmin];
      } else {
        query = `
          SELECT I.*, CONCAT(U.Nombre, ' ', U.ApPaterno, ' ', U.ApMaterno) AS NombreCompleto
          FROM Ingreso I 
          INNER JOIN Usuario U ON I.IdUsuario = U.IdUsuario 
          WHERE I.IdUsuario = ?
        `;
        params = [idUser];
      }

      const ingresos = await pool.query(query, params);
      res.json({ ingresos });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener los ingresos' });
    }
  }

  public async create(req: Request, res: Response): Promise<void> {
    const { idUser } = req.params;
    const ingreso = req.body;
    ingreso.IdUsuario = idUser;

    try {
      await pool.query('INSERT INTO Ingreso SET ?', [ingreso]);
      res.json({ message: 'Ingreso guardado' });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear el ingreso' });
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
        result = await pool.query('DELETE FROM Ingreso WHERE IdIngreso = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Ingreso.IdUsuario AND CodigoAdmin = ?)', [id, CodigoAdmin]);
      } else {
        result = await pool.query('DELETE FROM Ingreso WHERE IdIngreso = ? AND IdUsuario = ?', [id, idUser]);
      }

      if (result.affectedRows > 0) {
        res.json({ message: 'Ingreso eliminado' });
      } else {
        res.status(404).json({ error: 'Ingreso no encontrado o el usuario no coincide' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al eliminar el ingreso' });
    }
  }

  public async update(req: Request, res: Response): Promise<void> {
    const { id, idUser } = req.params;
    const ingreso = req.body;

    try {
      const usuario = await pool.query('SELECT * FROM Usuario WHERE IdUsuario = ?', [idUser]);

      if (usuario.length === 0) {
        res.status(404).json({ error: 'Usuario no encontrado' });
        return;
      }

      const { Rol, CodigoAdmin } = usuario[0];

      let result;
      if (Rol === 'admin') {
        result = await pool.query('UPDATE Ingreso SET ? WHERE IdIngreso = ? AND EXISTS (SELECT 1 FROM Usuario WHERE IdUsuario = Ingreso.IdUsuario AND CodigoAdmin = ?)', [ingreso, id, CodigoAdmin]);
      } else {
        result = await pool.query('UPDATE Ingreso SET ? WHERE IdIngreso = ? AND IdUsuario = ?', [ingreso, id, idUser]);
      }

      if (result.affectedRows > 0) {
        res.json({ message: 'Ingreso actualizado' });
      } else {
        res.status(404).json({ error: 'Ingreso no encontrado o el usuario no coincide' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al actualizar el ingreso' });
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
          SELECT * FROM Ingreso WHERE IdIngreso = ? AND EXISTS (
            SELECT 1 FROM Usuario WHERE IdUsuario = Ingreso.IdUsuario AND CodigoAdmin = ?
          )
        `;
        params = [id, CodigoAdmin];
      } else {
        query = 'SELECT * FROM Ingreso WHERE IdIngreso = ? AND IdUsuario = ?';
        params = [id, idUser];
      }

      const ingreso = await pool.query(query, params);

      if (ingreso.length > 0) {
        ingreso[0].FechaIngreso = ingreso[0].FechaIngreso.toISOString().split('T')[0];
        res.json(ingreso[0]);
      } else {
        res.status(404).json({ text: 'El ingreso no existe o no tiene acceso' });
      }
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al obtener el ingreso' });
    }
  }
}

export const ingresoController = new IngresoController();
export default ingresoController;
