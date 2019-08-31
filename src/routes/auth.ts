import express from 'express';
import auth from '../middlewares/auth';
import {
  getUserInfo,
  userLoginValidator,
  userLogin
} from '../controllers/auth';
const router = express.Router({ strict: true });

/**
 * @route GET api/auth
 * @desc  get authenticated user information
 * @access private
 */
router.get('/', auth, getUserInfo);

/**
 * @route POST api/auth
 * @desc authenticate user
 * @access public
 */
router.post('/', userLoginValidator, userLogin);

export default router;
