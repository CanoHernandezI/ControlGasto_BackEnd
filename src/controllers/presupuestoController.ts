import { Request, Response } from 'express';
import pool from '../database';

class PresupuestoController {

  public async list(req: Request, res: Response): Promise<void> {
    const { idUser } = req.params;
    try {
      const presupuestos = await pool.query('SELECT * FROM Presupuesto WHERE IdUsuario = ?', [idUser]);
      res.json({ presupuestos });
      console.log('Presupuesto:', presupuestos);
    } catch (err) {
      res.status(500).json({ error: 'Error al obtener los gastos' });
    }
  }
}

export const presupuestoController = new PresupuestoController();
export default presupuestoController;
