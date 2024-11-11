import { Schema, model } from "mongoose";
import { SubscriptionToUpdates } from "../types";

const subscriptionSchema = new Schema<SubscriptionToUpdates>({
    email: {type: String,required: true, unique: true},
    name: {type: String, required: true},
    subscriptionDate: {type: String, required: true},
    subscriptionTime: {type: String, required: true},
})

export const SubscriptionModel = model<SubscriptionToUpdates>('Subscriptions', subscriptionSchema);
