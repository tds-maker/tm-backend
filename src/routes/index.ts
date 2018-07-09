import { Application } from 'express';
import jwt from '../utils/middlewares/jwt.middleware';
import folderRoutes from './folders/folders.route';
import templatesRoutes from './templates/templates.route';
export class Routes {       
    public routes(app:Application): void {          
        app.use('/folders', jwt, folderRoutes);
        app.use('/templates', jwt, templatesRoutes);
    }
}