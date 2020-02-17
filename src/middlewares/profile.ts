import { check } from 'express-validator';

export const createProfileValidator = [
  check('status', 'Status is required')
    .not()
    .isEmpty(),
  check('skills', 'Skills is required')
    .not()
    .isEmpty()
];

export const experienceValidator = [
  check('title', 'title is required')
    .not()
    .isEmpty(),
  check('company', 'The company is required.')
    .not()
    .isEmpty(),
  check('from', 'The start from date is required.')
    .not()
    .isEmpty()
];

export const educationValidator = [
  check('school', 'School is required')
    .not()
    .isEmpty(),
  check('degree', 'The degree is required.')
    .not()
    .isEmpty(),
  check('fieldofstudy', 'The field of study is required.')
    .not()
    .isEmpty(),
  check('from', 'The start from date is required.')
    .not()
    .isEmpty()
];
