import { BlogModel } from "../models/Blogs";
import { Request, Response } from "express";
import { MulterRequest } from "../types";
import fs from "fs";
import { uploadImage } from "../utils/uploadImage";
import { deleteCloudinaryImage } from "../utils/deleteCloudinaryImage";
import { NotFoundError } from "../exceptions/errors";
import mongoose from "mongoose";

export const createBlog = async (req: MulterRequest, res: Response) => {
 
  try {
    const filePath = req.file?.path;

    
    if (!filePath || !fs.existsSync(filePath)) {
      throw new NotFoundError("No file uploaded");
    }

    const { title, category, description } = req.body;

    // Check if the blog exists with same title
    const existingBlogWithTitle = await BlogModel.findOne({ title });
    const existingBlogAsWhole = await BlogModel.findOne({
      title,
      category,
      description,
    });
    if (existingBlogAsWhole) {
      return res.status(409).json({
        message: "Blog already exists",
        blog: existingBlogAsWhole,
      });
    } else if (existingBlogWithTitle) {
      return res.status(409).json({
        message: "Blog already exists with same title",
        blog: existingBlogWithTitle,
      });
    }

    const { imageUrl, imagePublicId, fileName } = await uploadImage(filePath);

    const now = new Date();

    const lastlyUpdatedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(now);

    const lastlyUpdatedTime = now.toTimeString().slice(0, 5);

    const blogToSave = new BlogModel({
      title,
      category,
      description,
      imageUrl,
      imagePublicId,
      lastlyUpdatedDate,
      lastlyUpdatedTime,
      fileName
    });
    await blogToSave.save();

    return res.status(201).json({
      message: "Blog created successfully",
      blog: blogToSave,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      res.status(404).json({
        message: error.message,
        
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    } else if (error instanceof Error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
};

export const updateBlog = async (req: MulterRequest, res: Response) => {

  try {
    const { blog_id } = req.params;
    let updatedBlogData = req.body;

    const filePath = req.file?.path;
    let imageUrl 
    let imagePublicId
    let fileName
    if (filePath) {
      const uploadResult = await uploadImage(filePath);
      imageUrl = uploadResult.imageUrl
      imagePublicId = uploadResult.imagePublicId
      fileName = uploadResult.fileName
    }

    const now = new Date();
    
    const lastlyUpdatedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(now);

    const lastlyUpdatedTime = now.toTimeString().slice(0, 5);

    updatedBlogData = { ...updatedBlogData, imageUrl, imagePublicId,fileName, lastlyUpdatedTime, lastlyUpdatedDate };

   
    const updatedBlog = await BlogModel.findByIdAndUpdate(
      blog_id,
      updatedBlogData,
      { new: true }
    );
    if (!updatedBlog) {
      return res.status(404).json({
        message: "Blog to updated not found",
      });
    }

    return res.status(200).json({
      message: "Updated blog successfully",
      blog: updatedBlog,
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: error.message
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    } else if (error instanceof Error) {
      return res.status(500).json({
        message: error.message
      });
    }
  }
};

export const getAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogs = await BlogModel.find();
    return res.status(200).json({
      message: "Blogs successfully retrieved",
      blogs,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    }
  }
};

export const getSingleBlog = async (req: Request, res: Response) => {
  try {
    const { blog_id } = req.params;
    const blog = await BlogModel.findById(blog_id);
    if (!blog) {
      return res.status(404).json({
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      message: "Blog successfully retrieved",
      blog,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    }
  }
};

export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { blog_id } = req.params;
    const blogToDelete = await BlogModel.findById(blog_id);
    let imagePublicId;
    if (blogToDelete) {
      imagePublicId = blogToDelete.imagePublicId;
      await deleteCloudinaryImage(imagePublicId);

      await BlogModel.findByIdAndDelete(blog_id);

      return res.status(204).json({
        message: "Blog deleted successfully",
      });
    }

    return res.status(404).json({
      message: "Blog to be not found",
    });
  } catch (error) {
    if (error instanceof NotFoundError) {
      return res.status(404).json({
        message: error.message
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    }
  }
};

export const deleteAllBlogs = async (req: Request, res: Response) => {
  try {
    const blogsToDelete = await BlogModel.find();
    if (blogsToDelete.length === 0) {
      return res.status(404).json({
        message: "No blogs to delete",
        blog: blogsToDelete,
      });
    }

    for (const blog of blogsToDelete) {
      await deleteCloudinaryImage(blog.imagePublicId);
    }

    const deletedBlogs = await BlogModel.deleteMany();

    return res.status(204).json({
      message: "All blogs deleted successfully",
      blog: deletedBlogs.deletedCount,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({
        message: error.message
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    }
  }
};
