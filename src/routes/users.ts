import express from 'express';
import { userRegisterValidator, userLogin } from '../controllers/users';
const router = express.Router({ strict: true });

/**
 * @route POST api/users
 * @desc register user
 * @access public
 */
router.post('/', userRegisterValidator, userLogin);

export default router;
