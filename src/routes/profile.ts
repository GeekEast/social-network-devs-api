import express from 'express';
import {} from '../controllers/profile';
const router = express.Router({ strict: true });

/**
 * @route GET api/profile/me
 * @desc  Get current user profile
 * @access Priave
 */
router.get('/me', (req, res) => {
  res.status(200).send('profiles');
});

export default router;
