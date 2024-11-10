import {Schema, model} from "mongoose"
import { Blog } from "../types/blog.types"

const blogSchema = new Schema<Blog>({
    title: {type: String, required: true},
    category: {type: String, required: true},
    description: {type: String, required: true},
    imageUrl: {type: String, required: true},
    imagePublicId: {type: String,required: true},
})

export const BlogModel = model<Blog>('Blogs', blogSchema )