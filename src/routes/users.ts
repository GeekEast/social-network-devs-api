import { Router } from 'express';
import { userRegisterValidator } from '../middlewares';
import { createUser } from '../controllers/users';
const router = Router({ strict: true });

/**
 * @route POST api/users
 * @desc register user
 * @access public
 */
router.post('/', userRegisterValidator, createUser);

export default router;
