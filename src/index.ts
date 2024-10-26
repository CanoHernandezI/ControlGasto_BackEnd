import express, { Application } from 'express';
import indexRoutes from './routes/indexRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import morgan from 'morgan';
import cors from 'cors';
import gastoRoutes from './routes/gastoRoutes';
import ingresoRoutes from './routes/ingresoRoutes';
import servicioRoutes from './routes/servicioRoutes';
import presupuestoRoutes from './routes/presupuestoRoutes';
import ubicacionRoutes from './routes/ubicacionRoutes';
import twitterRoutes from './routes/twitterRoutes'; 
import tarjetaRoutes from './routes/tarjetaRoutes';

class Server {
    public app: Application;

    constructor() {
        this.app = express();
        this.config();
        this.routes();
    }

    config(): void {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: false }));
    }

    routes(): void {
        this.app.use('/', indexRoutes);
        this.app.use('/api/usuario', usuarioRoutes);
        this.app.use('/api/gasto', gastoRoutes);
        this.app.use('/api/ingreso', ingresoRoutes);
        this.app.use('/api/servicio', servicioRoutes);
        this.app.use('/api/presupuesto', presupuestoRoutes);
        this.app.use('/api/ubicacion', ubicacionRoutes);
        this.app.use('/api/twitter', twitterRoutes);
        this.app.use('/api/tarjetas', tarjetaRoutes);
    }

    start(): void {
        this.app.listen(this.app.get('port'), () => {
            console.log('Server on port', this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();
