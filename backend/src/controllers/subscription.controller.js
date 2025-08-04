import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Subscription } from "../models/subscription.model.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async(req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required")
    }

    const subscriber = await Subscription.create({
        subscriber: req.user._id,
        channel: new mongoose.Types.ObjectId(channelId)
    })

    if (!subscriber) {
        throw new ApiError(400, "Failed to subscribe to channel")
    }

    return res.status(200).json(new ApiResponse(200, subscriber, "Subscribed to channel successfully"))
})

const getUserChannelSubscribers = asyncHandler(async(req, res) => {
    const { channelId } = req.params;

    if (!channelId) {
        throw new ApiError(400, "Channel ID is required")
    }

    const subscribers = await Subscription.countDocuments({
        channel: new mongoose.Types.ObjectId(channelId)
    })

    if (!subscribers) {
        throw new ApiError(404, "No subscribers found")
    }

    return res.status(200).json(new ApiResponse(200, subscribers, "Subscribers fetched successfully"))
})

const getSubscribedChannels = asyncHandler(async(req, res) => {
    const { subscriberId } = req.params;

    if (!subscriberId) {
        throw new ApiError(400, "Subscriber ID is required")
    }

    const subscribedChannels = await Subscription.countDocuments({
        subscriber: new mongoose.Types.ObjectId(subscriberId)
    })
    
    if (!subscribedChannels) {
        throw new ApiError(404, "No subscribed channels found")
    }

    return res.status(200).json(new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}