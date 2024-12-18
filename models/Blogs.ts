import {Schema, model} from "mongoose"
import { Blog } from "../types/blog.types"

const blogSchema = new Schema<Blog>({
    title: {type: String, required: [true,"Title is required"]},
    category: {type: String, required: [true,"Category is required"]},
    description: {type: String, required: [true,"Description is required"]},
    imageUrl: {type: String, required: [true,"ImageUrl is required"]},
    imagePublicId: {type: String,required: [true,"ImagePublicId is required"]},
    lastlyUpdatedDate: {type: String,required: [true,"LastUpdatedDate is required"]},
    lastlyUpdatedTime: {type: String,required: [true,"LastUpdatedTime is required"]},
    fileName: {type: String,required: [true,"FileName is required"]}
})

export const BlogModel = model<Blog>('Blogs', blogSchema )