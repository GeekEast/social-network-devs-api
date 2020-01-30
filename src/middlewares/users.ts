import { check } from 'express-validator';

export const userRegisterValidator = [
  check('name', 'Name is required')
    .not()
    .isEmpty(),
  check('email', 'Please include your Email Address').isEmail(),
  check('password', 'Please Enter a password more than 6 characters').isLength({
    min: 6
  })
];

export const userLoginValidator = [
  check('email', 'Please include your Email Address').isEmail(),
  check('password', 'Password is required').exists()
];
