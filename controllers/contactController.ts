import { Request, Response, RequestHandler } from "express";
import { ContactModel } from "../models/Contacts";
import mongoose from "mongoose";
import { emailSender } from "../utils/emailSender";
import dotenv from "dotenv";
import { EMAILCONTEXT } from "../constants/emailContext";

dotenv.config();

const senderEmail = process.env.GMAIL_SENDER_EMAIL;

export const createContact = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, subject, message, email } = req.body;
    // Check if the same contact exists
    const existingBlog = await ContactModel.findOne({
      first_name,
      last_name,
      subject,
      message,
      email,
    });

    if (existingBlog) {
      return res.status(409).json({
        message: "The same contact already exists",
        existingBlog,
      });
    }

    //Now continue if to create new contact
    const now = new Date();

    const createdAtDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(now);

    const createdAtTime = now.toTimeString().slice(0, 5);

    const createdAt = createdAtDate + " , " + createdAtTime;
    const lastlyUpdatedAt = createdAt;

    const contactToBeSaved = new ContactModel({
      first_name,
      last_name,
      subject,
      message,
      email,
      createdAt,
      lastlyUpdatedAt,
    });

    await contactToBeSaved.save();

    const contacterName = first_name + " " + last_name;
    const contacterEmail = email;

    emailSender(contacterEmail,EMAILCONTEXT.CONTACT ,subject, message, contacterName );

    return res.status(201).json({
      message: "Contact saved successfully",
      contact: contactToBeSaved,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: validationErrors[0],
      });
    }
  }
};

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await ContactModel.find();
    return res.status(200).json({
      message: "Contacts retrieved successfully",
      contacts,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error while retrieving contacts",
        error: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    }
  }
};

export const getSingleContact = async (req: Request, res: Response) => {
  try {
    const { contact_id } = req.params;
    const contact = await ContactModel.findById(contact_id);
    if (!contact) {
      return res.status(404).json({
        message: "Contact not found",
      });
    }

    return res.status(200).json({
      message: "Contact successfully retrieved",
      contact,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error while fetching contact",
        error: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    }
  }
};

export const updateContact = async (req: Request, res: Response) => {
  try {
    const { contact_id } = req.params;
    let updatedData = req.body;
    const now = new Date();

    const lastlyUpdatedDate = new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(now);

    const lastlyUpdatedTime = now.toTimeString().slice(0, 5);

    const lastlyUpdatedAt = lastlyUpdatedDate + " , " + lastlyUpdatedTime;

    updatedData = { ...updatedData, lastlyUpdatedAt };
    const updatedContact = await ContactModel.findByIdAndUpdate(
      contact_id,
      updatedData,
      { new: true }
    );
    if (!updatedContact) {
      return res.status(404).json({
        message: "Contact to update not found",
      });
    }
    return res.status(200).json({
      message: "Contact updated successfully",
      contact: updatedContact,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error while updating contact",
        error: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    }
  }
};

export const deleteContact = async (req: Request, res: Response) => {
  try {
    const { contact_id } = req.params;
    const deletedContact = await ContactModel.findByIdAndDelete(contact_id);
    if (!deletedContact) {
      return res.status(404).json({
        message: "Contact to be deleted not found",
      });
    }

    return res.status(204).json({
      message: "Contact deleted successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error while deleting contact",
        error: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    }
  }
};

export const deleteAllContacts = async (req: Request, res: Response) => {
  try {
    const deletedContacts = await ContactModel.deleteMany();
    if (deletedContacts.deletedCount == 0) {
      return res.status(404).json({
        message: "There were no contacts to delete",
        deletedContacts: deletedContacts.deletedCount,
      });
    }
    return res.status(204).json({
      message: "All Contacts deleted successfully",
      deletedContacts: deletedContacts.deletedCount,
    });
  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error while deleting all contacts",
        error: error.message,
      });
    } else if (error instanceof mongoose.Error.ValidationError) {
      const validationErrors = Object.values(error.errors).map(
        (err) => err?.message
      );
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors,
      });
    }
  }
};
