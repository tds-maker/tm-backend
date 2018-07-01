import { NextFunction, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import config from '../../config'

import {IRequest, ITokenData} from '../../interfaces';

const isEmpty = (obj:object):boolean =>{
    return Object.keys(obj).length === 0;
}

const middleware = (req: IRequest, res: Response, next: NextFunction) => {
  const token = clearToken(req.headers.authorization);
  jwt.verify(token, config.jwtSecret, (err:any, decoded:ITokenData) => {
    if (err) {
      res.status(403).json(isEmpty(err) ? { message: "Wrong token!" } : err);
    } else {
      req.tokenData = decoded;
      next();
    }
  });
};

const clearToken = (token: string) => {
  if (/\s/g.test(token)) {
    return token.split(" ")[1];
  } else {
    return token;
  }
};

export default middleware;
