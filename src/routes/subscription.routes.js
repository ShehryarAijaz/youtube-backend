import {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
} from "../controllers/subscription.controller.js"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import { Router } from "express"

const router = Router()

router.route("/subscribe/:channelId").post(verifyJWT, toggleSubscription)
router.route("/get-channel-subscribers/:channelId").get(verifyJWT, getUserChannelSubscribers)
router.route("/get-subscribed-channels/:subscriberId").get(verifyJWT, getSubscribedChannels)

export default router;