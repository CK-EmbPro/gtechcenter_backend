import { BlogModel } from "../models/Blogs";
import { Request, Response } from "express";
import { MulterRequest } from "../types";
import fs from "fs";
import cloudinary from "../config/cloudinaryConfig";
import { uploadImage } from "../utils/uploadImage";
import { upload } from "../config/multerConfig";
import { deleteCloudinaryImage } from "../utils/deleteCloudinaryImage";

export const createBlog = async (req: MulterRequest, res: Response) => {
  try {
    const filePath = req.file?.path;

    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error("File does not exist or is not accessible");
    }

    const { title, category, description } = req.body;

    // Check if the blog exists with same title
    const existingBlogWithTitle = await BlogModel.findOne({title})
    const existingBlogAsWhole = await BlogModel.findOne({title, category, description})
    if(existingBlogAsWhole){
      return res.status(409).json({
        message: "Blog already exists",
        existingBlog: existingBlogAsWhole
      })
    }else if(existingBlogWithTitle){
      return res.status(409).json({
        message: "Blog already exists with same title",
        existingBlog: existingBlogWithTitle
      })
    }

    const { imageUrl, imagePublicId } = await uploadImage(filePath);
    const blogToSave = new BlogModel({
      title,
      category,
      description,
      imageUrl,
      imagePublicId,
    });
    await blogToSave.save();

    return res.status(201).json({
      message: "Blog created successfully",
      blog: blogToSave,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while saving blog",
      error,
    });
  }
};

export const updateBlog = async (req: MulterRequest, res: Response) => {
  try {
    const { blog_id } = req.params;
    let updatedBlogData = req.body;
    const filePath = req.file?.path;

    if (!filePath || !fs.existsSync(filePath)) {
      throw new Error("plz upload a file");
    }

    const { imageUrl, imagePublicId } = await uploadImage(filePath);
    updatedBlogData = { ...updatedBlogData, imageUrl, imagePublicId };
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
      updatedBlog,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while updating blog",
      error,
    });
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
    res.status(500).json({
      message: "Error while retrieving blogs",
      error,
    });
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
    return res.status(500).json({
      message: "Error while retrieving blog",
      error,
    });
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
    return res.status(500).json({
      message: "Error while deleting blog",
    });
  }
};

export const deleteAllBlogs = async(req:Request, res:Response)=>{
    try {
        const blogsToDelete = await BlogModel.find()
        if(blogsToDelete.length === 0){
            return res.status(404).json({
                message: "No blogs to delete",
                blogs: blogsToDelete
            })
        }

        for(const blog of blogsToDelete){
            await deleteCloudinaryImage(blog.imagePublicId)
        }

        await BlogModel.deleteMany()

        return res.status(204).json({
            message: "All blogs deleted successfully"
        })
    } catch (error) {
        res.status(500).json({
            message: "Error while deleting all blogs",
            error
        })
    }
}