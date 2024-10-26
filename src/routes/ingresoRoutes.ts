import { Router } from 'express';
import ingresoController from '../controllers/ingresoController';

class IngresoRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get('/:idUser', ingresoController.list);
    this.router.post('/:idUser', ingresoController.create);
    this.router.delete('/:idUser/:id', ingresoController.delete);
    this.router.put('/:idUser/:id', ingresoController.update);
    this.router.get('/:idUser/:id', ingresoController.getOne);
  }
}

const ingresoRoutes = new IngresoRoutes();
export default ingresoRoutes.router;
