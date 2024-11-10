import {Router} from "express"
import {
    createSubscription,
    deleteAllSubs,
    deleteSubscription,
    getAllSubscriptions,
    getSingleSubscription,
    updateSubscription
} from '../controllers/subscriptionController'

export const subscriptionRouter = Router()

// @ts-ignore
subscriptionRouter.get('/subscribe', getAllSubscriptions)

// @ts-ignore
subscriptionRouter.get('/subscribe/:sub_id', getSingleSubscription)

// @ts-ignore
subscriptionRouter.put('/subscribe/:sub_id', updateSubscription)

// @ts-ignore
subscriptionRouter.post('/subscribe', createSubscription)

// @ts-ignore
subscriptionRouter.delete('/subscribe/:sub_id', deleteSubscription)

// @ts-ignore
subscriptionRouter.delete('/subscribe', deleteAllSubs)
