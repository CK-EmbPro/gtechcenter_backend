import { Schema, model } from "mongoose";
import { SubscriptionToUpdates } from "../types";

const subscriptionSchema = new Schema<SubscriptionToUpdates>({
    email: {type: String,required: [true, "Email is required"], unique: true, match: [/.+@.+\..+/, "Please enter a valid email address"]},
    subscriptionDate: {type: String, required: [true, "subscriptionDate is required"]},
    subscriptionTime: {type: String, required: [true, "subscriptionTime is required"]},
})

export const SubscriptionModel = model<SubscriptionToUpdates>('Subscriptions', subscriptionSchema);
