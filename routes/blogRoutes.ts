import Router from "express"
import { createBlog, deleteAllBlogs, deleteBlog, getAllBlogs, getSingleBlog, updateBlog } from "../controllers/blogController"
import { upload } from "../config/multerConfig"
import { authMiddleware } from "../middlewares/AuthMiddleware"
import { adminMiddleware } from "../middlewares/AdminMiddleware"

export const blogRouter = Router()

// @ts-ignore
blogRouter.get('/blogs', getAllBlogs)

// @ts-ignore
blogRouter.get('/blogs/:blog_id', getSingleBlog)

// @ts-ignore
blogRouter.post('/blogs',adminMiddleware, upload.single('file'), createBlog)

// @ts-ignore
blogRouter.put('/blogs/:blog_id',adminMiddleware, upload.single('file'), updateBlog)

// @ts-ignore
blogRouter.delete('/blogs/:blog_id',adminMiddleware, deleteBlog)

// @ts-ignore
blogRouter.delete('/blogs',adminMiddleware, deleteAllBlogs)

