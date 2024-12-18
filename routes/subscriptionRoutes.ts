import {Router} from "express"
import {
    createSubscription,
    deleteAllSubs,
    deleteSubscription,
    getAllSubscriptions,
    getSingleSubscription,
    updateSubscription
} from '../controllers/subscriptionController'
import { authMiddleware } from "../middlewares/AuthMiddleware"
import { adminMiddleware } from "../middlewares/AdminMiddleware"

export const subscriptionRouter = Router()

// @ts-ignore
subscriptionRouter.get('/subscribe',adminMiddleware, getAllSubscriptions)

// @ts-ignore
subscriptionRouter.get('/subscribe/:sub_id',adminMiddleware, getSingleSubscription)

// @ts-ignore
subscriptionRouter.put('/subscribe/:sub_id',adminMiddleware, updateSubscription)

// @ts-ignore
subscriptionRouter.post('/subscribe', createSubscription)

// @ts-ignore
subscriptionRouter.delete('/subscribe/:sub_id',adminMiddleware, deleteSubscription)

// @ts-ignore
subscriptionRouter.delete('/subscribe',adminMiddleware, deleteAllSubs)
