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

export const contactRouter = Router()

// @ts-ignore
contactRouter.post('/contacts', createContact ) 

// @ts-ignore
contactRouter.get('/contacts', getAllContacts)

// @ts-ignore
contactRouter.get('/contacts/:contact_id', getSingleContact)

// @ts-ignore
contactRouter.put('/contacts/:contact_id', updateContact)

// @ts-ignore
contactRouter.delete('/contacts/:contact_id', deleteContact)

// @ts-ignore
contactRouter.delete('/contacts', deleteAllContacts)
