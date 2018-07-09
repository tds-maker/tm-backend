import {model, Model, Schema} from 'mongoose';

import IDefaultModel from '../interfaces/IDefaultModel';

export interface ITemplateModel extends IDefaultModel {
    _id:string;
    accountId:string;
    folderId:string;
    name:string;
    productNumberOption:string;
    languages:string[];
    primaryLanguage:string;
    minorVersion?:number;
    majorVersion?:number;
    version?: string;
}

export const TemplateSchema:Schema = new Schema({
    _id : String,
    accountId : {
        type : String,
        required : true
    },
    folderId : {
        type : String,
        required : true
    },
    name : {
        type: String,
        required : true
    },
    productNumberOption : {
        type: String, required: true
    },
    languages : {
        type: Array, required : true
    },
    primaryLanguage : {
        type: String, required : true
    },
    minorVersion: {
        type: Number, default: 1
    },
    majorVersion : { type: Number, default : 0},
    createdBy: {type: String, required: true},
    modifiedBy: {type: String, required: true, ref : 'User'}
},{
    timestamps: true,
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
});

TemplateSchema.virtual('version').get(function(){
    return `v${this.majorVersion}.${this.minorVersion}`;
})

export default model<ITemplateModel>("Template", TemplateSchema) as Model<ITemplateModel>;