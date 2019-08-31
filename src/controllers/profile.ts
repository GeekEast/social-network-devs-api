import { Request, Response } from 'express';
import { Profile, User } from '../models';
import _ from 'lodash';
import { check, validationResult } from 'express-validator';
import moment from 'moment';
import generateRequest from '../services/github';
import { renameSync } from 'fs';

const getCurrentUserProfile = async (req: Request, res: Response) => {
  try {
    const user_id = _.get(req, ['user', 'id']);
    const profile = await Profile.findOne({ user_id }).populate('user_id', [
      'name',
      'avatar'
    ]);
    if (!profile) {
      return res.status(400).json({
        msg: 'No Profile for this user'
      });
    }
    res.send(profile);
  } catch (err) {
    res.status(500).send('Internal Server Errors');
  }
};

const getAllProfiles = async (req: Request, res: Response) => {
  try {
    const profiles = await Profile.find().populate('user_id', [
      'name',
      'avatar'
    ]);
    res.json(profiles);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error!');
  }
};

const getProfileByUserId = async (req: Request, res: Response) => {
  try {
    const user_id = _.get(req, ['params', 'user_id']);
    const profile = await Profile.findOne({ user_id: user_id }).populate(
      'user_id',
      ['name', 'avatar']
    );
    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for the user.' });
    }
    res.json(profile);
  } catch (err) {
    if (err.kind && err.kind === 'ObjectId') {
      return res.status(500).send('There is no profile for the user');
    }
    res.status(500).send('Internal Server Error');
  }
};

const createProfileValidator = [
  check('status', 'Status is required')
    .not()
    .isEmpty(),
  check('skills', 'Skills is required')
    .not()
    .isEmpty()
];
const createUserProfile = async (req: Request, res: Response) => {
  // validation failed -> return errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      company,
      location,
      status,
      skills,
      bio,
      githubusername,
      experience,
      youtube,
      twitter,
      facebook,
      linkedin,
      instagram
    } = req.body;
    const user_id = _.get(req, ['user', 'id']);

    const profileObject = {};
    user_id && _.set(profileObject, 'user_id', user_id);
    company && _.set(profileObject, 'company', company);
    location && _.set(profileObject, 'location', location);
    status && _.set(profileObject, 'status', status);
    bio && _.set(profileObject, 'bio', bio);
    githubusername && _.set(profileObject, 'githubusername', githubusername);
    experience && _.set(profileObject, 'experience', experience);
    skills &&
      _.set(
        profileObject,
        'skills',
        (<string>skills).split(',').map(skill => skill.trim())
      );
    const socialObject = {};
    youtube && _.set(socialObject, 'youtube', youtube);
    twitter && _.set(socialObject, 'twitter', twitter);
    facebook && _.set(socialObject, 'facebook', facebook);
    linkedin && _.set(socialObject, 'linkedin', linkedin);
    instagram && _.set(socialObject, 'instagram', instagram);
    _.set(profileObject, 'social', socialObject);

    try {
      const foundProfile = await Profile.findOne({ user_id });
      // update existing
      if (foundProfile) {
        const profile = await Profile.findOneAndUpdate(
          { user_id },
          { $set: profileObject },
          { new: true }
        );
        // console.log(profile);
        return res.json(profile);
      }

      // create new profile
      const profile = new Profile(profileObject);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.log(err);
      res.status(500).send('Internal Server Errors');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Errors');
  }
};

const deleteProfilUserPostsByUserId = async (req: Request, res: Response) => {
  try {
    const user_id = _.get(req, ['user', 'id']);
    // TODO: - remove user posts
    await Profile.findOneAndRemove({ user_id });
    await User.findOneAndRemove({ _id: user_id });
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

const experienceValidator = [
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
const createOrUpdateExperience = async (req: Request, res: Response) => {
  // validation failed -> return errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // get information from req
    const user_id = _.get(req, ['user', 'id']);
    const {
      title,
      company,
      location,
      from,
      to,
      current,
      description
    } = req.body;

    // build a experience
    const experienceObject = {};
    title && _.set(experienceObject, 'title', title);
    company && _.set(experienceObject, 'company', company);
    location && _.set(experienceObject, 'location', location);
    from &&
      _.set(experienceObject, 'from', moment(from, 'DD-MM-YYYY').toDate());
    to && _.set(experienceObject, 'to', moment(to, 'DD-MM-YYYY').toDate());
    current && _.set(experienceObject, 'current', current);
    description && _.set(experienceObject, 'description', description);

    // add the experience to profile
    const profile = await Profile.findOne({ user_id });
    const newExp = [..._.get(profile, 'experience'), experienceObject];
    _.set(profile as object, 'experience', newExp);
    await profile!.save();

    // return the new profile
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};
const deleteExperienceById = async (req: Request, res: Response) => {
  try {
    // get the user id
    const user_id = _.get(req, ['user', 'id']);
    // get the profile
    const profile = await Profile.findOne({ user_id });
    // get the experience array
    const experiences = _.get(profile, ['experience']) as Array<{}>;

    if (!experiences) {
      return res.status(400).json({ msg: 'No experiences' });
    }

    // update the experiences array
    const experience_id = _.get(req, ['params', 'experience_id']);
    const newExpers = experiences.filter(
      exper => String(_.get(exper, '_id')) !== experience_id
    );

    // save the changes tot mongoDb
    _.set(profile as object, 'experience', newExpers);
    await profile!.save();
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};
const educationValidator = [
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
const createOrUpdateEducation = async (req: Request, res: Response) => {
  // validation failed -> return errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // get information from req
    const user_id = _.get(req, ['user', 'id']);
    const {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description
    } = req.body;

    // build a education
    const educationObject = {};
    school && _.set(educationObject, 'school', school);
    degree && _.set(educationObject, 'degree', degree);
    fieldofstudy && _.set(educationObject, 'fieldofstudy', fieldofstudy);
    from && _.set(educationObject, 'from', moment(from, 'DD-MM-YYYY').toDate());
    to && _.set(educationObject, 'to', moment(to, 'DD-MM-YYYY').toDate());
    current && _.set(educationObject, 'current', current);
    description && _.set(educationObject, 'description', description);

    // add the education to profile
    const profile = await Profile.findOne({ user_id });
    const newEdu = [..._.get(profile, 'education'), educationObject];
    _.set(profile as object, 'education', newEdu);
    await profile!.save();

    // return the new profile
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};
const deleteEducationById = async (req: Request, res: Response) => {
  try {
    // get the user id
    const user_id = _.get(req, ['user', 'id']);
    // get the profile
    const profile = await Profile.findOne({ user_id });
    // get the education array
    const educations = _.get(profile, 'education') as Array<{}>;

    if (!educations) {
      return res.status(400).json({ msg: 'no educations' });
    }

    // update the educations array
    const education_id = _.get(req, ['params', 'education_id']);
    const newEdus = educations.filter(
      edu => String(_.get(edu, '_id')) !== education_id
    );

    // save the changes tot mongoDb
    _.set(profile as object, 'education', newEdus);
    await profile!.save();
    res.json(profile);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

const getGithubRepoByUsername = async (req: Request, res: Response) => {
  try {
    const username = _.get(req, ['params', 'username']);
    const API = generateRequest(username);
    API.get('/')
      .then(result => {
        if (_.get(result, 'status') !== 200) {
          return res.status(404).json({ msg: 'No Github User.' });
        }
        res.json(_.get(result, 'data'));
      })
      .catch(err => {
        console.log(err);
        return res.status(400).send('Internal Server Error');
      });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

export {
  getCurrentUserProfile,
  getAllProfiles,
  createProfileValidator,
  createUserProfile,
  getProfileByUserId,
  deleteProfilUserPostsByUserId,
  experienceValidator,
  createOrUpdateExperience,
  deleteExperienceById,
  educationValidator,
  createOrUpdateEducation,
  deleteEducationById,
  getGithubRepoByUsername
};
