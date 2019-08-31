import jwt from 'jsonwebtoken';
import config from 'config';
import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.header('x-auth-token');
  if (!token) {
    return res.status(401).json({ msg: 'No token, authentication denied' });
  }

  try {
    const secret = <string>config.get('Auth.JWT_SECRET');
    const decoded = jwt.verify(token as string, secret);
    _.set(req, 'user', _.get(decoded, 'user'));
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Invalid Token' });
  }
};
