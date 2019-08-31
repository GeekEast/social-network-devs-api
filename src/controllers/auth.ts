import { Request, Response } from 'express';
import { User } from '../models';
import _ from 'lodash';
import { check, validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';

const getUserInfo = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(_.get(req, ['user', 'id'])).select(
      '-password'
    ); // without password
    res.json({ user }); // default 200
  } catch (err) {
    res.status(500).send('Internal Server Error!');
  }
};

const userLoginValidator = [
  check('email', 'Please include your Email Address').isEmail(),
  check('password', 'Password is required').exists()
];
const userLogin = async (req: Request, res: Response) => {
  // validation failed -> return errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // validation passed
  const { password, email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid Credentials'
          }
        ]
      });
    }

    const hash = _.get(user, 'password');
    const isMatch = await bcrypt.compare(password, hash);
    if (!isMatch) {
      return res.status(400).json({
        errors: [
          {
            msg: 'Invalid Credentials'
          }
        ]
      });
    }

    // status: registered
    const payload = {
      user: {
        id: _.get(user, 'id')
      }
    };
    const secret = <string>config.get('Auth.JWT_SECRET');
    jwt.sign(
      payload,
      secret,
      {
        expiresIn: '1d'
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (err) {
    res.status(500).send('Internal Server Errors');
  }
};

export { getUserInfo, userLoginValidator, userLogin };
