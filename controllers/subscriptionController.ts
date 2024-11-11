import { BlogModel } from "../models/Blogs";
import { SubscriptionModel } from "../models/SubscriptionToUpdates";
import { Request, Response } from "express";

export const createSubscription = async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    // Check if subscription already exists
    const existingSubscription = await SubscriptionModel.findOne({email, name})
    if(existingSubscription){
      return res.status(409).json({
        message: "Subscription already exists",
        existingSubscription
      })
    }
    const now = new Date();
    const subscriptionDate = now.toISOString().split("T")[0];
    const subscriptionTime = now.toTimeString().slice(0, 5);
    const createdSubscription = new SubscriptionModel({
      email,
      name,
      subscriptionDate,
      subscriptionTime,
    });


    await createdSubscription.save();
    return res.status(201).json({
      message: "Subscription created successfully",
      createdSubscription,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while creating subscription",
      error,
    });
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
    res.status(500).json({
      message: "Error while retrieving subscriptions",
      error,
    });
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
    res.status(500).json({
      message: "Error while retrieving subscriptions",
      error,
    });
  }
};

export const updateSubscription = async (req: Request, res: Response) => {
  try {
    const { sub_id } = req.params;
    const updatedSubscriptionData = req.body;
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
      updatedSubscription,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error while retrieving subscriptions",
      error,
    });
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
  } catch (error) {
    res.status(500).json({
      message: "Error while retrieving subscriptions",
      error,
    });
  }
};

export const deleteAllSubs = async (req: Request, res: Response) => {
  try {
    const subscriptions = await BlogModel.find();
    if (subscriptions.length === 0) {
      return res.status(404).json({
        message: "No  subscriptions to delete",
      });
    }

    await SubscriptionModel.deleteMany();
    return res.status(204).json({
      message: "All subscriptions deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
        message: "Error deleting all subscriptions"
    })
  }
};
