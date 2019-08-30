import jwt from 'jsonwebtoken';
import config from 'config';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

const secret = <string>config.get('Auth.JWT_SECRET');
export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authentication denied' });
  }

  try {
    const decoded = jwt.verify(token as string, secret);
    _.set(req, 'user', _.get(decoded, 'user'));
    console.log(_.get(req, 'user'));
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid Token' });
  }
};
