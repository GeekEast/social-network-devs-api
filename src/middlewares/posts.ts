import { check } from 'express-validator';

export const createNewPostValidator = [
  check('text', 'Text is required')
    .not()
    .isEmpty()
];

export const commentsValidator = [
  check('text', 'Content is required.')
    .not()
    .isEmpty()
];
