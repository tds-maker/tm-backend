import {Document, Model, model, Schema} from 'mongoose';

export interface IUserModel extends Document {
    _id : string,
    accountId : string,
    firstName : string,
    lastName:string,
}

export const UserSchema:Schema = new Schema({
    _id : String,
    accountId : {
        type : String,
        required : true
    },
    firstName:String,
    lastName:String
}, {
    toObject: { virtuals: true },
    toJSON: { virtuals: true }
})

UserSchema.virtual('fullName').get(function() {
    return `${this.firstName} ${this.lastName}`;
})

UserSchema.virtual('fullNameShort').get(function() {
    return `${this.firstName} ${this.lastName.substring(0,1).toUpperCase()}.`;
})

export default model<IUserModel>("User", UserSchema) as Model<IUserModel>;
