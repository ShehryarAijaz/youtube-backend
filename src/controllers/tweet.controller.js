import asyncHandler from "../utils/asyncHandler.js";
import { Tweet } from '../models/tweet.model.js'
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const createTweet = asyncHandler( async(req, res) => {
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const tweet = await Tweet.create({
        owner: req.user._id,
        content
    })

    if (!tweet) {
        throw new ApiError(400, "Failed to create tweet")
    }

    return res.status(201).
    json(new ApiResponse(201, tweet, "Tweet created successfully"))
} )

const getUserTweets = asyncHandler( async(req, res) => {
    const { userId } = req.params

    if (!userId) {
        throw new ApiError(400, "User ID is required")
    }

    const tweets = await Tweet.find(
        {
            owner: new mongoose.Types.ObjectId(userId)
        }
    )

    if (!tweets) {
        throw new ApiError(404, "No tweets found")
    }

    return res.status(200).
    json(new ApiResponse(200, tweets, "Tweets fetched successfully"))
} )

const updateTweet = asyncHandler( async(req, res) => {
    const { tweetId } = req.params
    const { content } = req.body

    if (!content) {
        throw new ApiError(400, "Tweet ID is required")
    }

    const tweet = await Tweet.findByIdAndUpdate(
        new mongoose.Types.ObjectId(tweetId),
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    )

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    return res.status(200).
    json(new ApiResponse(200, tweet, "Tweet updated successfully"))
} )

const deleteTweet = asyncHandler( async(req, res) => {
    const { tweetId } = req.params

    if (!tweetId) {
        throw new ApiError(400, "Tweet ID is required")
    }

    const tweet = await Tweet.findByIdAndDelete(
        new mongoose.Types.ObjectId(tweetId)
    )

    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    return res.status(200).
    json(new ApiResponse(200, tweet, "Tweet deleted successfully"))
} )

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}

