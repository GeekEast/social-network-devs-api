import express from 'express';
import auth from '../middlewares/auth';
import {
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
 * @route DELETE /api/posts
 * @desc delete a post
 * @access private
 */
router.post('/', auth, deletePost);

/**
 * @route POST /api/posts/likes
 * @desc add a like to a post
 * @access private
 */
router.put('/likes', auth, createOrUpdateLikes);

/**
 * @route DELETE /api/posts/likes
 * @desc minus a like of a post
 * @access private
 */
router.delete('/likes', auth, deleteLike);

/**
 * @route POST /api/posts/comments
 * @desc add a comment to a post
 * @access private
 */
router.put('/comments', auth, createOrUpdateComments);

/**
 * @route DELETE /api/posts/comments
 * @desc delete a comment of a post
 * @access private
 */
router.delete('/likes', auth, deleteComment);

export default router;
