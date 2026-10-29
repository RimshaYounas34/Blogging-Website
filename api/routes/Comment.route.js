import express from 'express'
import {
  addcomment,
  commentCount,
  deleteComment,
  getAllComments,
  getComments,
  replyToComment,
  toggleLikeComment
} from '../controllers/Comment.controller.js'

import { authenticate } from '../middleware/authenticate.js'

const CommentRoute = express.Router()

// Add a new comment
CommentRoute.post('/add', authenticate, addcomment)

// Get all top-level comments (with replies grouped) for a blog
CommentRoute.get('/get/:blogid', getComments)

// Get total comment count for a blog
CommentRoute.get('/get-count/:blogid', commentCount)

// Admin/User - Get all comments
CommentRoute.get('/get-all-comment', authenticate, getAllComments)

// Delete a specific comment
CommentRoute.delete('/delete/:commentid', authenticate, deleteComment)

// ✅ New Routes
// Reply to a comment
CommentRoute.post('/reply', authenticate, replyToComment)

// Like/unlike a comment
CommentRoute.post('/like/:id', authenticate, toggleLikeComment)

export default CommentRoute
