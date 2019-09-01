import { check, validationResult } from 'express-validator';
import { Request, Response } from 'express';
import { Post, User } from '../models';
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
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'post does not exist!' });
    }
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

const createOrUpdateLikes = async (req: Request, res: Response) => {
  try {
    const post_id = _.get(req, ['params', 'post_id']).toString();
    const user_id = _.get(req, ['user', 'id']).toString();

    const post = await Post.findById(post_id);

    const likes = <Array<Object>>_.get(post, ['likes']);
    if (
      likes.filter(like => _.get(like, ['user']).toString() === user_id)
        .length > 0
    ) {
      return res.status(400).json({ msg: 'Already liked' });
    }

    const newLikes = [...likes, { user: user_id }];
    _.set(post!, 'likes', newLikes);
    await post!.save();
    res.json(_.get(post, 'likes'));
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

const deleteLikeById = async (req: Request, res: Response) => {
  try {
    const post_id = _.get(req, ['params', 'post_id']);
    const user_id = _.get(req, ['user', 'id']);

    const post = await Post.findById(post_id);
    const likes = <Array<Object>>_.get(post, ['likes']);

    if (!likes) {
      return res.status(400).json({ msg: 'no likes exist' });
    }
    const newLikes = likes.filter(
      like => _.get(like, 'user').toString() !== user_id
    );
    _.set(post!, 'likes', newLikes);
    post!.save();
    res.json(_.get(post, 'likes'));
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

const commentsValidator = [
  check('text', 'Content is required.')
    .not()
    .isEmpty()
];
const createOrUpdateCommentsByID = async (req: Request, res: Response) => {
  // validation failed -> return errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const post_id = _.get(req, ['params', 'post_id']).toString();
    const user_id = _.get(req, ['user', 'id']).toString();

    const commentObject = {};
    const user = await User.findById(user_id).select(['name', 'avatar']);
    const name = _.get(user, 'name');
    const avatar = _.get(user, 'avatar');
    const text = _.get(req, ['body', 'text']);

    user_id && _.set(commentObject, 'user', user_id);
    name && _.set(commentObject, 'name', name);
    avatar && _.set(commentObject, 'avatar', avatar);
    text && _.set(commentObject, 'text', text);

    const post = await Post.findById(post_id);
    const comments = <Array<Object>>_.get(post, ['comments']);
    const newComments = [...comments, commentObject];
    _.set(post!, 'comments', newComments);
    await post!.save();
    res.json(_.get(post, 'comments'));
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

const deleteCommentById = async (req: Request, res: Response) => {
  try {
    const post_id = _.get(req, ['params', 'post_id']);
    const comment_id = _.get(req, ['params', 'comment_id']);

    const post = await Post.findById(post_id);
    const comments = <Array<Object>>_.get(post, ['comments']);

    if (!comments) {
      return res.status(400).json({ msg: 'no comments exist' });
    }

    const newComments = comments.filter(
      comment => _.get(comment, '_id').toString() !== comment_id
    );
    _.set(post!, 'comments', newComments);
    post!.save();
    res.json({ msg: 'comment deleted' });
  } catch (err) {
    console.log(err);
    res.status(500).send('Internal Server Error');
  }
};

export {
  createNewPostValidator,
  createNewPost,
  getAllPosts,
  getPostById,
  deleteLikeById,
  deletePostById,
  createOrUpdateLikes,
  commentsValidator,
  createOrUpdateCommentsByID,
  deleteCommentById
};
