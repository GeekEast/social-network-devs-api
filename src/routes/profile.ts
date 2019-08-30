import express from 'express';
const router = express.Router({ strict: true });

router.get('/', (req, res) => {
  res.status(200).send('profiles');
});

export default router;
