import cloudinary from "../config/cloudinary.js";
import { handleError } from "../helpers/handleError.js";
import User from "../models/user.model.js";
import Blog from "../models/blog.model.js";
import Category from "../models/category.model.js";
import bcryptjs from 'bcryptjs';

export const getUser = async (req, res, next) => {
    try {
        const { userid } = req.params;
        const user = await User.findOne({ _id: userid }).lean().exec();
        if (!user) {
            next(handleError(404, 'User not found.'));
        }
        res.status(200).json({
            success: true,
            message: 'User data found.',
            user
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const data = JSON.parse(req.body.data);
        const { userid } = req.params;

        const user = await User.findById(userid);
        user.name = data.name;
        user.email = data.email;
        user.bio = data.bio;

        if (data.password && data.password.length >= 8) {
            const hashedPassword = bcryptjs.hashSync(data.password);
            user.password = hashedPassword;
        }

        if (req.file) {
            // Upload an image
            const uploadResult = await cloudinary.uploader
                .upload(
                    req.file.path,
                    { folder: 'yt-mern-blog', resource_type: 'auto' }
                )
                .catch((error) => {
                    next(handleError(500, error.message));
                });

            user.avatar = uploadResult.secure_url;
        }

        await user.save();

        // Get the updated counts for users, blogs, and categories
        const usersCount = await User.countDocuments();
        const blogsCount = await Blog.countDocuments();
        const categoriesCount = await Category.countDocuments();

        const newUser = user.toObject({ getters: true });
        delete newUser.password;

        res.status(200).json({
            success: true,
            message: 'Data updated.',
            user: newUser,
            usersCount,  // Return updated user count
            blogsCount,  // Return updated blogs count
            categoriesCount  // Return updated categories count
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const getAllUser = async (req, res, next) => {
    try {
        const user = await User.find().sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            user
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. Find the user
    const userToDelete = await User.findById(id).lean();
    if (!userToDelete) {
      return next(handleError(404, 'User not found.'));
    }

    // 2. Guard-rail: don’t delete the last admin
    const isAdmin = userToDelete.role === 'admin' || userToDelete.isAdmin === true;
    if (isAdmin) {
      const adminCount = await User.countDocuments({
        $or: [{ role: 'admin' }, { isAdmin: true }],
      });

      if (adminCount <= 1) {
        // 🚫 Block the deletion and return a clear message
        return res.status(400).json({
          success: false,
          message: 'At least one admin must remain. The last admin cannot be deleted.',
        });
      }
    }

    // 3. Proceed with deletion
    await User.findByIdAndDelete(id);

    // 4. Refresh dashboard counts
    const usersCount = await User.countDocuments();
    const blogsCount = await Blog.countDocuments();
    const categoriesCount = await Category.countDocuments();

    // 5. Respond with success
    res.status(200).json({
      success: true,
      message: 'User deleted.',
      usersCount,
      blogsCount,
      categoriesCount,
    });
  } catch (error) {
    next(handleError(500, error.message));
  }
};


