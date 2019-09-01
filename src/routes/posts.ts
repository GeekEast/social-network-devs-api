import express from 'express';
import auth from '../middlewares/auth';
import {
  createNewPostValidator,
  createNewPost,
  getAllPosts,
  getPostById,
  deletePostById,
  createOrUpdateLikes,
  deleteLikeById,
  commentsValidator,
  createOrUpdateCommentsByID,
  deleteCommentById
} from '../controllers/posts';
const router = express.Router({ strict: true });

/**
 * @route POST /api/posts
 * @desc create a new post
 * @access private
 */
router.post('/', auth, createNewPostValidator, createNewPost);

/**
 * @route GET /api/posts
 * @desc get all posts
 * @access private
 */
router.get('/', auth, getAllPosts);

/**
 * @route GET /api/posts/:post_id
 * @desc get post by post id
 * @access private
 */
router.get('/:post_id', auth, getPostById);

/**
 * @route DELETE /api/posts/:post_id
 * @desc delete post by post id
 * @access private
 */
router.delete('/:post_id', auth, deletePostById);

/**
 * @route POST /api/posts/likes/:post_id
 * @desc like a post
 * @access private
 */
router.put('/likes/:post_id', auth, createOrUpdateLikes);

/**
 * @route DELETE /api/posts/likes/:post_id
 * @desc unlike a post
 * @access private
 */
router.delete('/likes/:post_id', auth, deleteLikeById);

/**
 * @route POST /api/posts/comments/:post_id
 * @desc add a comment to a post
 * @access private
 */
router.put(
  '/comments/:post_id',
  auth,
  commentsValidator,
  createOrUpdateCommentsByID
);

/**
 * @route DELETE /api/posts/comments/:post_id/:comment_id
 * @desc delete a comment of a post
 * @access private
 */
router.delete('/comments/:post_id/:comment_id', auth, deleteCommentById);

export default router;
