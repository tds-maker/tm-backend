import {Document} from 'mongoose';

export default interface IDefaultModel extends Document {
    createdBy:string,
    createdAt: Date,
    modifiedBy:string,
    updatedAt: Date
}