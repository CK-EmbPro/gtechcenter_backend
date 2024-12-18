import {Schema,model } from 'mongoose'
import { Contact } from '../types'

const contactSchema = new Schema<Contact>({
    first_name: {type: String, required: [true, "First_name is required"]},
    last_name: {type: String, required: [true, "last_name is required"]},
    subject: {type: String, required: [true, "subject is required"]},
    message: {type: String, required:[true, "message is required"]},
    email: {type: String, required: [true, "email is required"]},
    createdAt: {type: String, required: [true, "creation timestamp is required"]},
    lastlyUpdatedAt: {type: String, required:[true, "last_update timestamp is required"]},
})

export const ContactModel  = model<Contact>('Contacts', contactSchema)
