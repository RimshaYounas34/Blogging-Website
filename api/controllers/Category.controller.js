import { handleError } from "../helpers/handleError.js";
import Category from "../models/category.model.js";
import Blog from "../models/blog.model.js"; // ✅ Import Blog model

export const addCategory = async (req, res, next) => {
    try {
        const { name, slug } = req.body;
        const category = new Category({ name, slug });
        await category.save();

        res.status(200).json({
            success: true,
            message: 'Category added successfully.'
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const showCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params;
        const category = await Category.findById(categoryid);
        if (!category) {
            return next(handleError(404, 'Data not found.'));
        }
        res.status(200).json({ category });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const updateCategory = async (req, res, next) => {
    try {
        const { name, slug } = req.body;
        const { categoryid } = req.params;
        const category = await Category.findByIdAndUpdate(
            categoryid,
            { name, slug },
            { new: true }
        );

        res.status(200).json({
            success: true,
            message: 'Category updated successfully.',
            category
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const deleteCategory = async (req, res, next) => {
    try {
        const { categoryid } = req.params;

        // ✅ Delete all blogs associated with this category
        await Blog.deleteMany({ category: categoryid });

        // ✅ Delete the category itself
        await Category.findByIdAndDelete(categoryid);

        res.status(200).json({
            success: true,
            message: 'Category and associated blogs deleted successfully.'
        });
    } catch (error) {
        next(handleError(500, error.message));
    }
};

export const getAllCategory = async (req, res, next) => {
    try {
        const category = await Category.find().sort({ name: 1 }).lean().exec();
        res.status(200).json({ category });
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
