import { Router } from 'express';
import usuarioController from '../controllers/usuarioController';

class UsuarioRoutes {
    public router: Router = Router();

    constructor() {
        this.config();
    }

    config(): void {
        this.router.get('/', usuarioController.list);
        this.router.post('/', usuarioController.create);
        this.router.delete('/:idUser', usuarioController.delete);
        this.router.put('/:idUser', usuarioController.update);
        this.router.get('/:identifier', usuarioController.getUserOrCheckUsername);
    }
}

const usuarioRoutes = new UsuarioRoutes();
export default usuarioRoutes.router;
