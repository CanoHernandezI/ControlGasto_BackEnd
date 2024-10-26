import { Router } from 'express';
import { ubicacionController } from '../controllers/ubicacionController';

class UbicacionRoutes {
  public router: Router = Router();

  constructor() {
    this.config();
  }

  config(): void {
    // Ruta para iniciar una nueva ruta
    this.router.post('/iniciar-ruta', ubicacionController.iniciarRuta);

    // Ruta para guardar una ubicación
    this.router.post('/guardar', ubicacionController.guardarUbicacion);

    // Ruta para actualizar la hora de salida de una ubicación
    this.router.put('/actualizar-salida', ubicacionController.actualizarHoraSalida);

    // Ruta para finalizar una ruta
    this.router.put('/finalizar-ruta', ubicacionController.finalizarRuta);

    // Ruta para obtener todas las rutas de un usuario
    this.router.get('/rutas/:idUsuario', ubicacionController.obtenerRutas);
  }
}

const ubicacionRoutes = new UbicacionRoutes();
export default ubicacionRoutes.router;
