import { handleError } from "../helpers/handleError.js";
import Comment from "../models/comment.model.js";

// ✅ Add a comment (main)
export const addcomment = async (req, res, next) => {
  try {
    const { user, blogid, comment } = req.body;
    const newComment = new Comment({ user, blogid, comment });

    await newComment.save();
    res.status(200).json({
      success: true,
      message: "Comment submitted.",
      comment: newComment,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Reply to a comment
export const replyToComment = async (req, res, next) => {
  try {
    const { user, blogid, parentId, comment } = req.body;  // changed `text` to `comment`

    if (!comment) {
      return next(handleError(400, "Reply comment text is required"));
    }

    const parent = await Comment.findById(parentId);
    if (!parent) return next(handleError(404, "Parent comment not found"));

    const reply = new Comment({
      user,
      blogid,
      comment,   // use comment here as per schema
      parentId,
    });

    await reply.save();
    await reply.populate("user", "name avatar");

    res.status(200).json({
      success: true,
      message: "Reply added.",
      reply,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Like/Unlike a comment
export const toggleLikeComment = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { id: commentId } = req.params;

    const comment = await Comment.findById(commentId);
    if (!comment) return next(handleError(404, "Comment not found"));

    const alreadyLiked = comment.likes.includes(userId);
    if (alreadyLiked) {
      comment.likes.pull(userId);
    } else {
      comment.likes.push(userId);
    }

    await comment.save();
    res.status(200).json({
      success: true,
      message: alreadyLiked ? "Unliked the comment." : "Liked the comment.",
      likes: comment.likes,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get all comments for a blog (including nested replies)
export const getComments = async (req, res, next) => {
  try {
    const { blogid } = req.params;

    const allComments = await Comment.find({ blogid })
      .populate("user", "name avatar")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const mainComments = allComments.filter(c => !c.parentId);
    const replies = allComments.filter(c => c.parentId);

    const commentsWithReplies = mainComments.map(comment => ({
      ...comment,
      replies: replies.filter(r => String(r.parentId) === String(comment._id)),
    }));

    res.status(200).json({ comments: commentsWithReplies });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get comment count for a blog
export const commentCount = async (req, res, next) => {
  try {
    const { blogid } = req.params;
    const commentCount = await Comment.countDocuments({ blogid });

    res.status(200).json({ commentCount });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Get all comments (admin/user)
export const getAllComments = async (req, res, next) => {
  try {
    const user = req.user;
    let query = user.role === "admin" ? {} : { user: user._id };

    const comments = await Comment.find(query)
      .populate({
        path: "blogid",
        select: "title category",
        populate: { path: "category", select: "name" },
      })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    res.status(200).json({ comments });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

// ✅ Delete comment with authorization and cascade delete replies
export const deleteComment = async (req, res, next) => {
  try {
    const { commentid } = req.params;
    const user = req.user;

    // Find the comment
    const comment = await Comment.findById(commentid);
    if (!comment) return next(handleError(404, "Comment not found"));

    // Check if user is admin or owner of comment
    if (user.role !== "admin" && String(comment.user) !== String(user._id)) {
      return next(handleError(403, " Not Allow Unauthorized to delete this comment"));
    }

    // Delete replies to this comment
    await Comment.deleteMany({ parentId: commentid });

    // Delete the comment itself
    await Comment.findByIdAndDelete(commentid);

    res.status(200).json({
      success: true,
      message: "Comment and its replies deleted.",
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};
