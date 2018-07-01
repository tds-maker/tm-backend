import {Response, Router} from 'express';
import { IRequest } from '../../interfaces';
import folderService from './folder.service';

const router = Router();

router
    .get('/:folderType', (req:IRequest, res:Response) => 
        folderService.getFolders(req.tokenData, req.params.folderType).then(data => res.send(data))
    )
    .post('/:folderType', (req:IRequest, res:Response) => {
        if(!req.body.name || !req.body.parentId || req.body.name.length === 0 || req.body.parentId.length === 0){
            return res.send({ message : 'Name and parent required', status : false});
        }else{
            return folderService.createFolder(req.tokenData, req.body.name, req.body.parentId, req.params.folderType).then(data => res.send({status : true, data}), err => res.send({status : false, message : err.message}))
        }
    });

export default router;