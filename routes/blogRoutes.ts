import Router from "express"
import { createBlog, deleteBlog, getAllBlogs, getSingleBlog, updateBlog } from "../controllers/blogController"
import { upload } from "../utils/multerConfig"

export const blogRouter = Router()

// @ts-ignore
blogRouter.get('/blogs', getAllBlogs)

// @ts-ignore
blogRouter.get('/blogs/:blog_id', getSingleBlog)

// @ts-ignore
blogRouter.post('/blogs', upload.single('file'), createBlog)

// @ts-ignore
blogRouter.put('/blogs/:blog_id',upload.single('file'), updateBlog)

// @ts-ignore
blogRouter.delete('/blogs/:blog_id', deleteBlog)

