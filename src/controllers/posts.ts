import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { Post, User, Profile } from '../models';
import _ from 'lodash';

const createNewPostValidator = [
  check('text', 'Text is required')
    .not()
    .isEmpty()
];

const createNewPost = async (req: Request, res: Response) => {
  // validation failed -> return errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { text } = req.body;
    //  get the username and user avatar;
    const user_id = <string>_.get(req, ['user', 'id']);
    const user = await User.findById(user_id).select(['name', 'avatar']);
    const name = _.get(user, 'name');
    const avatar = _.get(user, 'avatar');

    // create the post object
    const postObejct = {};
    text && _.set(postObejct, 'text', text);
    name && _.set(postObejct, 'name', name);
    avatar && _.set(postObejct, 'avatar', avatar);
    _.set(postObejct, 'user', user_id);

    // create a object
    const post = new Post(postObejct);

    // save to mongoDB
    await post.save();
    res.json(post);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const post_id = _.get(req, ['params', 'post_id']);
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({
        msg: "Post doesn't exist."
      });
    }
    res.json(post);
  } catch (err) {
    console.log(err);

    if (err.kind === 'ObjectId') {
      return res.status(404).json({
        msg: "Post doesn't exist."
      });
    }
    res.status(500).send('Internal Sever Error');
  }
};

const deletePostById = async (req: Request, res: Response) => {
  try {
    const post_id = _.get(req, ['params', 'post_id']);
    const post = await Post.findById(post_id);

    if (!post) {
      return res.status(404).json({ msg: 'post does not exist!' });
    }

    await post.remove();
    res.send({ msg: 'post removed' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

const deletePost = async (req: Request, res: Response) => {};

const createOrUpdateLikes = async (req: Request, res: Response) => {
  const user_id = _.get(req, ['user', 'id']);
};

const deleteLike = async (req: Request, res: Response) => {};

const createOrUpdateComments = async (req: Request, res: Response) => {};

const deleteComment = async (req: Request, res: Response) => {};

export {
  createNewPostValidator,
  createNewPost,
  getAllPosts,
  getPostById,
  deletePostById,
  deletePost,
  createOrUpdateLikes,
  deleteLike,
  createOrUpdateComments,
  deleteComment
};
