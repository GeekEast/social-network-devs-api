import { Router } from 'express';
import {
  getProfile,
  createProfile,
  getProfiles,
  getProfileByUserId,
  deleteProfileUserPostsByUserId,
  createOrUpdateExperience,
  deleteExperienceById,
  createOrUpdateEducation,
  deleteEducationById,
  getGithubRepoByUsername
} from '../controllers';
import {
  auth,
  educationValidator,
  experienceValidator,
  createProfileValidator
} from '../middlewares';
const router = Router({ strict: true });

/**
 * @route GET api/profile/me
 * @desc  get current user profile
 * @access private
 */
router.get('/me', auth, getProfile);

/**
 * @route GET api/profile
 * @desc  get all profiles
 * @access public
 */
router.get('/', getProfiles);

/**
 * @route GET api/profile/user/:user_id
 * @desc  get the profile by user_id
 * @access public
 */
router.get('/user/:user_id', getProfileByUserId);

/**
 * @route POST api/profile
 * @desc  create a user profile
 * @access private
 */
router.post('/', auth, createProfileValidator, createProfile);

/**
 * @route DELETE api/profile
 * @desc delete profile, user & posts
 * @access private
 */
router.delete('/', auth, deleteProfileUserPostsByUserId);

/**
 * @route PUT api/profile/experience
 * @desc update experience by authentication
 * @access private
 */
router.put('/experience', auth, experienceValidator, createOrUpdateExperience);

/**
 * @route DELETE api/profile/experience
 * @desc delete experience by :experience_id
 * @access private
 */
router.delete('/experience/:experience_id', auth, deleteExperienceById);

/**
 * @route PUT api/profile/education
 * @desc update education by authentication
 * @access private
 */
router.put('/education', auth, educationValidator, createOrUpdateEducation);

/**
 * @route DELETE api/profile/education
 * @desc delete education by :experience_id
 * @access private
 */
router.delete('/education/:education_id', auth, deleteEducationById);

/**
 * @route GET api/profile/github/username
 * @desc get github repos by username
 * @access private
 */
router.get('/github/:username', auth, getGithubRepoByUsername);

export default router;
