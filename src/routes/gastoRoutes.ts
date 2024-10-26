import { Router } from 'express';
import gastoController from '../controllers/gastoController';

class GastoRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get('/:idUser', gastoController.list);
    this.router.post('/:idUser', gastoController.create);
    this.router.delete('/:idUser/:id', gastoController.delete);
    this.router.put('/:idUser/:id', gastoController.update);
    this.router.get('/:idUser/:id', gastoController.getOne);
  }
}

const gastoRoutes = new GastoRoutes();
export default gastoRoutes.router;
