import {Schema,model } from 'mongoose'
import { Contact } from '../types'

const contactSchema = new Schema<Contact>({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    subject: {type: String, required: true},
    message: {type: String, required:true}
})

export const ContactModel  = model<Contact>('Contacts', contactSchema)

