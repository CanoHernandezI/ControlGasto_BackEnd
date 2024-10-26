import { Router } from 'express';
import tarjetaController from '../controllers/tarjetaController';

class TarjetaRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', tarjetaController.getAllTarjetas); // Obtener todas las tarjetas
        this.router.post('/agregar', tarjetaController.addTarjeta); // Agregar nueva tarjeta
        this.router.post('/transferencia', tarjetaController.simularTransferencia); // Simular transferencia
        this.router.get('/usuario/:IdUsuario', tarjetaController.getTarjetasByUsuario); // Nueva ruta para obtener tarjetas por usuario
        this.router.delete('/eliminar/:id', tarjetaController.eliminarTarjeta);
    }
}

const tarjetaRoutes = new TarjetaRoutes();
export default tarjetaRoutes.router;
