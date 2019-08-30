import express from 'express';
const router = express.Router({ strict: true });

import auth from '../routes/auth';
import posts from '../routes/posts';
import profile from '../routes/profile';
import users from '../routes/users';

router.use('/profile', profile);
router.use('/users', users);
router.use('/posts', posts);
router.use('/auth', auth);

router.get('/', (req, res) => {
  res.status(200).send('Express API');
});

export default router;
