import express from 'express';
import cors from 'cors'
import helmet from 'helmet';
import morgan from 'morgan';
import { dbConnection } from './mongo.js';
import loginRoutes from '../src/login/login.routes.js';
import adminRoutes from '../src/administradores/administrador.routes.js';
import clienteRoutes from '../src/cliente/cliente.routes.js';


class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.loginPath = '/proyectoFinal/v1/login';
        this.adminPath = '/proyectoFinal/v1/admin';
        this.clientePath = '/proyectoFinal/v1/cliente';
        this.conectarDB(); 
        this.middlewares();
        this.routes();
        global.sesion = "";
    }

    async conectarDB() {
        await dbConnection();
    }

    
    middlewares() {
        this.app.use(express.urlencoded({ extended: false }));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    };

   
    routes() {
        this.app.use(this.loginPath, loginRoutes);
        this.app.use(this.adminPath, adminRoutes);
        this.app.use(this.clientePath, clienteRoutes);
    };

    listen() {
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;