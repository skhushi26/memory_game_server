import { NestMiddleware, Injectable } from '@nestjs/common';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';

/** The AuthMiddleware is used to
 * (1) read the request header bearer token/user access token
 * (2) decrypt the access token to get the user object
 */
@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req: Request, res: Response, next: Function) {
    const token = req.headers.authorization.split(' ')[1];
    await jwt.verify(token, process.env.SECRET_KEY, (err, decoded) => {
      if (err) {
        res.status(401).send({ message: 'Unauthorized' });
      } else {
        next();
      }
    });
  }
}
