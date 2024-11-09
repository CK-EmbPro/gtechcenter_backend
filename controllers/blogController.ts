import { BlogModel } from "../models/Blogs"
import { Request, Response } from "express"
import { MulterRequest } from "../types"
import fs from 'fs'
import cloudinary from "../utils/cloudinaryConfig"
import { uploadImage } from "../utils/uploadImage"


export const createBlog = async(req:MulterRequest, res: Response)=>{
    try {
        const filePath = req.file?.path

        if (!filePath || !fs.existsSync(filePath)) {
            throw new Error("File does not exist or is not accessible");
          }
        const imageUrl = await uploadImage(filePath)
        const {title, category, description} = req.body
        const blogToSave = new BlogModel({title, category, description, imageUrl})
        await blogToSave.save()

        return res.status(201).json({
            message: "Blog created successfully",
            blog: blogToSave
        })

    } catch (error) {
        res.status(500).json({
            message: "Error while saving blog",
            error
        })
    }
}

export const updateBlog = async(req:Request, res: Response)=>{
    try {
        const {blog_id} = req.params
        const updatedBlogData = req.body
        const updatedBlog = await BlogModel.findByIdAndUpdate(blog_id, updatedBlogData, {new: true})
        if(!updatedBlog){
            return res.status(404).json({
                message: "Blog to updated not found"
            })
        }


        return res.status(200).json({
            message: "Updated blog successfully",
            updateBlog
        })
    } catch (error) {
        res.status(500).json({
            message: "Error while updating blog",
            error
        })
    }
}

export const getAllBlogs = async(req:Request, res: Response)=>{
    try {
        const blogs = await BlogModel.find()
        return res.status(200).json({
            message: "Blogs successfully retrieved", 
            blogs
        })        
    } catch (error) {
        res.status(500).json({
            message: "Error while retrieving blogs",
            error
        })        
    }
}

export const getSingleBlog = async(req:Request, res: Response)=>{
    try {
        const {blog_id} = req.params
        const blog = await BlogModel.findById(blog_id)
        if(!blog){
            return res.status(404).json({
                message: "Blog not found",

            })
        }

        return res.status(200).json({
            message: "Blog successfully retrieved",
            blog
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error while retrieving blog",
            error
        })        
    }
}

export const deleteBlog = async(req:Request, res: Response)=>{
    try {
        const {blog_id} = req.params
        const deletedBlog = await BlogModel.findByIdAndDelete(blog_id)
        if(!deletedBlog) {
            return res.status(404).json({
                message: "Blog to be not found",
            })
        }

        return res.status(204).json({
            message: "Blog deleted successfully",
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error while deleting blog",
        })
    }
}