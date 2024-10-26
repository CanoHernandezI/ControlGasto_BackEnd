import { servicioController } from './../controllers/servicioController';
import { Router } from 'express';

class ServicioRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    this.router.get('/:idUser', servicioController.list);
    this.router.post('/:idUser', servicioController.create);
    this.router.delete('/:idUser/:id', servicioController.delete);
    this.router.put('/:idUser/:id', servicioController.update);
    this.router.get('/:idUser/:id', servicioController.getOne);
  }
}

const servicioRoutes = new ServicioRoutes();
export default servicioRoutes.router;
