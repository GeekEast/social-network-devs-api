import { Router } from 'express';
import { getUser, loginUser } from '../controllers';
import { auth, userLoginValidator } from '../middlewares';
const router = Router({ strict: true });

/**
 * @route GET api/auth
 * @desc  get authenticated user information
 * @access private
 */
router.get('/', auth, getUser);

/**
 * @route POST api/auth
 * @desc authenticate user
 * @access public
 */
router.post('/', userLoginValidator, loginUser);

export default router;
