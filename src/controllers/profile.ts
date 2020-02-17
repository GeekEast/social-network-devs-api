import { Request, Response } from 'express';
import { Profile, User, Post } from '../models';
import _ from 'lodash';
import { validationResult } from 'express-validator';
import moment from 'moment';
import { generateRequest } from '../services';

export const getProfile = async (req: Request, res: Response) => {
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

export const getProfiles = async (req: Request, res: Response) => {
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

export const getProfileByUserId = async (req: Request, res: Response) => {
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

export const createProfile = async (req: Request, res: Response) => {
  // validation failed -> return errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const {
      company,
      website,
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
    website && _.set(profileObject, 'website', website);
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

export const deleteProfileUserPostsByUserId = async (
  req: Request,
  res: Response
) => {
  try {
    const user_id = _.get(req, ['user', 'id']);
    await Post.deleteMany({ user: user_id });
    await Profile.findOneAndRemove({ user_id });
    await User.findOneAndRemove({ _id: user_id });
    res.json({ msg: 'User removed' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

export const createOrUpdateExperience = async (req: Request, res: Response) => {
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

export const deleteExperienceById = async (req: Request, res: Response) => {
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

export const createOrUpdateEducation = async (req: Request, res: Response) => {
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

export const deleteEducationById = async (req: Request, res: Response) => {
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

export const getGithubRepoByUsername = async (req: Request, res: Response) => {
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
