import * as crypto from 'crypto';
import { Query } from 'mongoose';

import { IFolder } from '../../interfaces';
import ITokenData from '../../interfaces/ITokenData';
import {Folder, FolderSchema, IFolderModel} from '../../models'

//#region Private Functions
const createRootFolder = (tokenData:ITokenData, folderType:string) => {
    const id =  crypto.createHash('md5').update(`${tokenData.accountId}-${folderType}`).digest('hex');
    const newFolder = new Folder({
        folderType,
        _id : id,
        accountId: tokenData.accountId,
        name : folderType === 'template' ? 'My Templates' : 'My Datasheets',
        folders : [],
        createdBy: tokenData.id,
        modifiedBy: tokenData.id
    })

    return newFolder.save();
}

//#endregion

const getFolders = (tokenData:ITokenData, folderType:string):Promise<any> => {
    return new Promise<any[]>((resolve, reject) => {
        Folder.find({
            folderType,
            accountId  : tokenData.accountId
        })
        .then(data => {
            if(data.length === 0){
                createRootFolder(tokenData, folderType).then(folder => {
                    resolve([folder]);
                })
            }else{
                resolve(data);
            }
        })
    })
}

const createFolder = (tokenData:ITokenData, name:string, parentId:string, folderType:string):Promise<any> => {
    return new Promise((resolve, reject) => {
        const id =  crypto.createHash('md5').update(`${tokenData.accountId}-${folderType}-${parentId}-${name}`).digest('hex');

        const newFolder = new Folder({
            folderType,
            _id : id,
            accountId : tokenData.accountId,
            name,
            parentId,
            folders : [],
            createdBy: tokenData.id,
            modifiedBy: tokenData.id
        })

        newFolder.save().then(() => {
            Folder.update({accountId : tokenData.accountId, _id : parentId, folderType}, { $push: { folders: id } })
            .then(res => {
                resolve(newFolder);
            }, err => console.log(err));
        }, err => reject({ message : `You have already folder named ${name} under current folder.`}));

    })
}

const removeFolder = (folderId:string):Query<any> => {
    return Folder.findByIdAndRemove(folderId);
}

const remoteAllFolders = (tokenData:ITokenData, folderType:string):Query<any> => {
    return Folder.remove({ accountId : tokenData.accountId, folderType});
}

export default {
    createFolder,
    getFolders,
    remoteAllFolders,
    removeFolder
}