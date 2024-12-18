import {Router, RequestHandler} from "express"
import {
    createContact,
    updateContact,
    deleteContact,
    getAllContacts,
    getSingleContact,
    deleteAllContacts,
} from "../controllers/contactController"
import { deleteAllBlogs } from "../controllers/blogController"
import { authMiddleware } from "../middlewares/AuthMiddleware"
import { adminMiddleware } from "../middlewares/AdminMiddleware"

export const contactRouter = Router()

// @ts-ignore
contactRouter.post('/contacts', createContact ) 

// @ts-ignore
contactRouter.get('/contacts',adminMiddleware,  getAllContacts)

// @ts-ignore
contactRouter.get('/contacts/:contact_id',authMiddleware,  getSingleContact)

// @ts-ignore
contactRouter.put('/contacts/:contact_id',adminMiddleware,  updateContact)

// @ts-ignore
contactRouter.delete('/contacts/:contact_id',adminMiddleware,  deleteContact)

// @ts-ignore
contactRouter.delete('/contacts',adminMiddleware,  deleteAllContacts)
