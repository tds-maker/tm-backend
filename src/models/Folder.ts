import {Document, Model, model, Schema} from 'mongoose';

export interface IFolderModel extends Document {
    _id : string,
    name : string,
    accountId : string,
    folderType:string,
    parentId?:string,
    folders: string[]
}

export const FolderSchema:Schema = new Schema({
    _id : String,
    name : {
        type: String,
        required : true
    },
    accountId : {
        type : String,
        required : true
    },
    folderType : {
        type : String,
        required : true
    },
    parentId: String,
    folders: {
        type : Array,
        default : []
    }
})


export default model<IFolderModel>("Folder", FolderSchema) as Model<IFolderModel>;