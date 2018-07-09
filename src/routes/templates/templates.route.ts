import {Response, Router} from 'express';
import { IRequest } from '../../interfaces';
import templatesService from './templates.service';

const router = Router();

router
    .get('/', (req:IRequest, res:Response) => {
        templatesService.get(req.tokenData.accountId).then(data => res.send(data));
    })
    .post('/', (req:IRequest, res:Response) => {
        templatesService.create(req.tokenData, req.body)
            .then(
                response => res.send({status : true, data : response}),
                err => res.send({status : false, message : err.message})
            );
    });

export default router;