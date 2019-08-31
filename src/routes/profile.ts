import express from 'express';
import {
  createProfileValidator,
  getCurrentUserProfile,
  createUserProfile,
  getAllProfiles,
  getProfileByUserId,
  deleteProfilUserPostsByUserId,
  experienceValidator,
  createOrUpdateExperience,
  deleteExperienceById,
  educationValidator,
  createOrUpdateEducation,
  deleteEducationById,
  getGithubRepoByUsername
} from '../controllers/profile';
import auth from '../middlewares/auth';
const router = express.Router({ strict: true });

/**
 * @route GET api/profile/me
 * @desc  get current user profile
 * @access private
 */
router.get('/me', auth, getCurrentUserProfile);

/**
 * @route GET api/profile
 * @desc  get all profiles
 * @access public
 */
router.get('/', getAllProfiles);

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
router.post('/', auth, createProfileValidator, createUserProfile);

/**
 * @route DELETE api/profile
 * @desc delete profile, user & posts
 * @access private
 */
router.delete('/', auth, deleteProfilUserPostsByUserId);

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
