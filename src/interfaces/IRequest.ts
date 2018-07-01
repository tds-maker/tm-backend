import { Request } from 'express';
import ITokenData from './ITokenData';

export default interface IRequest extends Request {
    tokenData:ITokenData
}