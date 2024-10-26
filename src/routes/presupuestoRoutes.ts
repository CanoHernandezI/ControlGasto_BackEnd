import { Router } from 'express';
import presupuestoController from '../controllers/presupuestoController';

class PresupuestoRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get('/:idUser', presupuestoController.list);
  }
}

const presupuestoRoutes = new PresupuestoRoutes();
export default presupuestoRoutes.router;
