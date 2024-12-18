import { UnAuthorizedError } from "../exceptions/errors";
import { BlogModel } from "../models/Blogs";
import { SubscriptionModel } from "../models/SubscriptionToUpdates";
import { Request, Response } from "express";
import mongoose from "mongoose"
import { emailSender } from "../utils/emailSender";
import { EMAILCONTEXT } from "../constants/emailContext";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    // Check if subscription already exists
    const existingSubscription = await SubscriptionModel.findOne({email})
    if(existingSubscription){
      return res.status(409).json({
        message: "Subscription already exists",
        subscription: existingSubscription
      })
    }
    const now = new Date();
    const subscriptionDate = now.toISOString().split("T")[0];
    const subscriptionTime = now.toTimeString().slice(0, 5);
    const createdSubscription = new SubscriptionModel({
      email,
      subscriptionDate,
      subscriptionTime,
    });


    await createdSubscription.save();

    emailSender(email, EMAILCONTEXT.SUBSCRIPTION)

    return res.status(201).json({
      message: "Subscription created successfully",
      subscription: createdSubscription,
    });
  } catch (error) {
    if(error instanceof mongoose.Error.ValidationError ){
      const validationErrors = Object.values(error.errors).map(err=>err?.message)
      return res.status(400).json({
        message: validationErrors[0],
        errors: validationErrors
      })

    }else if(error instanceof Error){
      return res.status(500).json({
        message: "Error while creating subscription at backend",
        error:error.message,
      });
    }
   
  }
};

export const getAllSubscriptions = async (req: Request, res: Response) => {
  try {
    const subscriptions = await SubscriptionModel.find();
    return res.status(200).json({
      message: "Subscriptions retrieved successfully",
      subscriptions,
    });
  } catch (error) {
    if(error instanceof UnAuthorizedError){
      res.status(403).json({
        message: "Forbidden operation",
        error: error.message
      })
    }
    if(error instanceof Error){
      res.status(500).json({
        message: "Error while retrieving subscriptions",
        error:error.message,
      });
    }else if(error instanceof mongoose.Error.ValidationError ){
      const validationErrors = Object.values(error.errors).map(err=>err?.message)
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors
      })

    }
  
  }
};

export const getSingleSubscription = async (req: Request, res: Response) => {
  try {
    const { sub_id } = req.params;
    const subscription = await SubscriptionModel.findById(sub_id);
    if (!subscription) {
      return res.status(404).json({
        message: "Subscription not found",
      });
    }

    return res.status(200).json({
      message: "Subscription successfully retrieved",
      subscription,
    });
  } catch (error) {
    if(error instanceof Error){
      res.status(500).json({
        message: "Error while retrieving subscriptions",
        error: error.message,
      });
    }else if(error instanceof mongoose.Error.ValidationError ){
      const validationErrors = Object.values(error.errors).map(err=>err?.message)
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors
      })

    }
 
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { sub_id } = req.params;
    let updatedSubscriptionData = req.body;

    const now = new Date();
    const subscriptionDate = now.toISOString().split("T")[0];
    const subscriptionTime = now.toTimeString().slice(0, 5);

    updatedSubscriptionData = {...updatedSubscriptionData, subscriptionDate, subscriptionTime}
    const updatedSubscription = await SubscriptionModel.findByIdAndUpdate(
      sub_id,
      updatedSubscriptionData,
      { new: true }
    );
    if (!updatedSubscription) {
      return res.status(404).json({
        message: "Subscription to be updated not found",
      });
    }

    return res.status(200).json({
      message: "Subscription updated successfully",
      subscription: updatedSubscription,
    });
  } catch (error) {
    if(error instanceof Error){
      res.status(500).json({
        message: "Error while retrieving subscriptions",
        error: error.message,
      });
    }else if(error instanceof mongoose.Error.ValidationError ){
      const validationErrors = Object.values(error.errors).map(err=>err?.message)
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors
      })

    }
   
  }
};

export const deleteSubscription = async (req: Request, res: Response) => {
  try {
    const { sub_id } = req.params;
    const deletedSubscription = await SubscriptionModel.findByIdAndDelete(
      sub_id
    );
    if (!deletedSubscription) {
      return res.status(404).json({
        message: "Subscription to be deleted not found",
      });
    }

    return res.status(204).json({
      message: "Subscription deleted successfully",
    });
  } catch (error){
    if(error instanceof Error){
      res.status(500).json({
        message: "Error while retrieving subscriptions",
        error:error.message,
      });
    }else if(error instanceof mongoose.Error.ValidationError ){
      const validationErrors = Object.values(error.errors).map(err=>err?.message)
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors
      })

    }
   
  }
};

export const deleteAllSubs = async (req: Request, res: Response) => {
  try {
    const deletedSubs = await SubscriptionModel.deleteMany();
    if (deletedSubs.deletedCount == 0) {
      return res.status(404).json({
        message: "There were no subscriptions to delete",
        subscription: deletedSubs.deletedCount,
      });
    }
    return res.status(204).json({
      message: "All subscriptions deleted successfully",
      subscription: deletedSubs.deletedCount,
    });

  } catch (error) {
    if (error instanceof Error) {
      return res.status(500).json({
        message: "Error while deleting subscriptions ",
        error: error.message,
      });
    }else if(error instanceof mongoose.Error.ValidationError ){
      const validationErrors = Object.values(error.errors).map(err=>err?.message)
      return res.status(400).json({
        message: "Model validation error",
        errors: validationErrors
      })

    }
  }
};
