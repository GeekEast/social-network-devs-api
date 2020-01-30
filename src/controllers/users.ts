import { validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { User } from '../models';
import gravatar from 'gravatar';
import bcrypt from 'bcryptjs';
import config from 'config';
import jwt from 'jsonwebtoken';
import _ from 'lodash';

export const createUser = async (req: Request, res: Response) => {
  // validation failed -> return errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  // validation passed: if user already exists
  const { name, password, email } = req.body;
  try {
    // if user already exists
    const userFound = await User.findOne({ email });
    if (userFound) {
      return res.status(400).json({
        errors: [
          {
            msg: 'User already exists'
          }
        ]
      });
    }
    // generate avatar url
    const avatar = gravatar.url(email, {
      s: '200',
      r: 'pg',
      d: 'mm'
    });

    // bcrypted password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create a object
    const user = new User({
      name,
      email,
      avatar,
      password: hashedPassword
    });
    // save to mongoDB
    await user.save();

    // status: registered
    const payload = {
      user: {
        id: user.id
      }
    };
    const secret = <string>config.get('Auth.JWT_SECRET');
    jwt.sign(
      payload,
      secret,
      {
        expiresIn: 360000
      },
      (err, token) => {
        if (err) throw err;
        res.status(200).json({ token });
      }
    );
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

export const getUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(_.get(req, ['user', 'id'])).select(
      '-password'
    ); // without password
    res.json({ user }); // default 200
  } catch (err) {
    res.status(500).send('Internal Server Error!');
  }
};

export const loginUser = async (req: Request, res: Response) => {
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
