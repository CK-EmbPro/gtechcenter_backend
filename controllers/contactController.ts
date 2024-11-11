import { Request, Response, RequestHandler } from "express";
import {ContactModel} from "../models/Contacts";




export const createContact = async (req: Request, res: Response) => {
    try {
        
        const {first_name, last_name, subject, message} = req.body
        // Check if the same contact exists
        const existingBlog = await ContactModel.findOne({first_name, last_name, subject, message})
        if(existingBlog){
            return res.status(409).json({
                message: "The same contact already exists",
                existingBlog
            })
        }

        //Now continue if to create new contact 
        const contactToBeSaved = new ContactModel({first_name, last_name, subject, message})
        await contactToBeSaved.save()
        return res.status(201).json({
            message: "Contact saved successfully",
            contact: contactToBeSaved

        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            message: "Error creating contact", 
            error
        })
    }
}

export const getAllContacts = async (req: Request, res: Response) => {
    try {
        const contacts = await ContactModel.find()
        return res.status(200).json({
            message: "Contacts retrieved successfully",
            contacts
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error while retrieving contacts",
            error
        })
        
    }
}

export const getSingleContact = async (req: Request, res: Response) => {
    try {
        const {contact_id} = req.params
        const contact = await ContactModel.findById(contact_id)
        if(!contact){
            return res.status(404).json({
                message: "Contact not found"
            })
        }

        return res.status(200).json({
            message: "Contact successfully retrieved",
            contact
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error while fetching contact",
            error
        })
    }
}


export const updateContact = async (req: Request, res: Response) => {
    try {
        const {contact_id} = req.params
        const updatedData = req.body
        const updatedContact = await ContactModel.findByIdAndUpdate(contact_id, updatedData, {new: true})
        if(!updatedContact) {
            return res.status(404).json({
                message: "Contact to update not found"
            })
        }
        return res.status(200).json({
            message: "Contact updated successfully",
            updatedContact
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error while updating contact",
            error
        })
    }
}

export const deleteContact = async (req: Request, res: Response) => {
    try {
        const {contact_id} = req.params
        const deletedContact = await ContactModel.findByIdAndDelete(contact_id)
        if(!deletedContact){
            return res.status(404).json({
                message: "Contact to be deleted not found"
            })
        }

        return res.status(204).json({
            message: "Contact deleted successfully"
        })
    } catch (error) {
        return res.status(500).json({
            message: "Error while deleting contact",
            error
        })
    }
}

export const deleteAllContacts= async(req: Request, res: Response)=>{
    try {
        
   
    const contacts = await ContactModel.find()
    if(contacts.length===0){
        return res.status(404).json({
            message: "No contacts to delete", 
            contacts
        })
    }

    await ContactModel.deleteMany()
    return res.status(204).json({
        message: "All Contacts deleted successfully"
    })
} catch (error) {
    return res.status(500).json({
        message: "Error while deleting all contacts"
    })
}
}