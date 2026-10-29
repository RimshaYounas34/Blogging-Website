import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Category from "../models/category.model.js";
import Comment from "../models/comment.model.js";
import DashboardStats from "../models/dashboardStats.model.js";  // نیا import

export const getDashboardStats = async (req, res, next) => {
  try {
    const usersCount = await User.countDocuments();
    const blogsCount = await Blog.countDocuments();
    const categoriesCount = await Category.countDocuments();
    const commentsCount = await Comment.countDocuments();

    // MongoDB میں save کریں
    const stats = new DashboardStats({
      usersCount,
      blogsCount,
      categoriesCount,
      commentsCount,
    });

    await stats.save();

    res.status(200).json({
      usersCount,
      blogsCount,
      categoriesCount,
      commentsCount,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};

export const getCategoryCount = async (req, res, next) => {
  try {
    const count = await Category.countDocuments();
    res.status(200).json({
      success: true,
      totalCategories: count
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
