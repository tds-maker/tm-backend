import { Application } from 'express';
import jwt from '../utils/middlewares/jwt.middleware';
import folderRoutes from './folders/folder.route';

export class Routes {       
    public routes(app:Application): void {          
        app.use('/folders', jwt, folderRoutes);
    }
}