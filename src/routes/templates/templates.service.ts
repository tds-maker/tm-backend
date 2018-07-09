import * as crypto from 'crypto';
import { Query } from 'mongoose';
import ITokenData from '../../interfaces/ITokenData';
import {ITemplateModel, Template} from '../../models';

const createNewTemplate = (tokenData:ITokenData, model:ITemplateModel|any = {}):Promise<any> => {
    const newTemplate = new Template(model);
    newTemplate._id = crypto.createHash('md5').update(`${tokenData.accountId}-${model.folderId}-${newTemplate.name}`).digest('hex');
    newTemplate.accountId = tokenData.accountId;
    newTemplate.createdBy = tokenData.id;
    newTemplate.modifiedBy = tokenData.id;
    return newTemplate.save();
}

const getTemplates = (accountId:string) => {
    return Template
            .find({ accountId }, { name :1, version:1, updatedAt:1, modifiedBy:1, majorVersion:1, minorVersion:1, folderId:1})
            .populate('modifiedBy');
}

const removeTemplate = (templateId:string):Query<any> => {
    return Template.findByIdAndRemove(templateId);
}

export default {
    create: createNewTemplate,
    remove: removeTemplate,
    get : getTemplates
}