import mongoose from "mongoose";
import { ApiError } from "../utils/ApiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { Like } from "../models/like.model.js";
import { Comment } from "../models/comment.model.js";

const toggleVideoLike = asyncHandler( async(req, res) => {
    const { videoId } = req.params;

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findById({
        _id: new mongoose.Types.ObjectId(videoId),
    })
    
    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const like = await Like.create({
        video: new mongoose.Types.ObjectId(videoId),
        likedBy: req.user?._id
    })

    if (!like) {
        throw new ApiError(500, "Something went wrong while liking the video")
    }

    return res.status(200).json(new ApiResponse(200, like, "Video liked successfully"))
} )

const toggleCommentLike = asyncHandler( async(req, res) => {
    const { commentId } = req.params;

    if (!commentId) {
        throw new ApiError(400, "Comment ID is required")
    }

    const comment = await Comment.findById({
        _id: new mongoose.Types.ObjectId(commentId),
    })
    
    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    const like = await Like.create({
        comment: new mongoose.Types.ObjectId(commentId),
        likedBy: req.user?._id
    })

    if (!like) {
        throw new ApiError(500, "Something went wrong while liking the comment")
    }

    return res.status(200).json(new ApiResponse(200, like, "Comment liked successfully"))
} )

const toggleTweetLike = asyncHandler( async(req, res) => {
    const { tweetId } = req.params;

    if (!tweetId) {
        throw new ApiError(400, "Tweet ID is required")
    }

    const tweet = await Comment.findById({
        _id: new mongoose.Types.ObjectId(tweetId),
    })
    
    if (!tweet) {
        throw new ApiError(404, "Tweet not found")
    }

    const like = await Like.create({
        tweet: new mongoose.Types.ObjectId(tweetId),
        likedBy: req.user?._id
    })

    if (!like) {
        throw new ApiError(500, "Something went wrong while liking the tweet")
    }

    return res.status(200).json(new ApiResponse(200, like, "Tweet liked successfully"))
} )

const getLikedVideos = asyncHandler( async(req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) -1) * parseInt(limit)

    const likedVideos = await Like.aggregate([
        {
            $match: {
                likedBy: new mongoose.Types.ObjectId(req.user?._id)
            }
        },
        {
            $sort: {
                createdAt: -1
            }
        },
        {
            $skip: skip
        },
        {
            $limit: parseInt(limit)
        },
        {
            $lookup: {
                from: "videos",
                localField: "video",
                foreignField: "_id",
                as: "likedVideo"
            }
        },
        {
            $addFields: {
                likedVideo: {
                    $first: "$likedVideo"
                }
            }
        },
        {
            $project: {
                likedVideo: 1,
                createdAt: 1
            }
        }
    ])

    if (!likedVideos.length) {
        throw new ApiError(404, "No liked videos found")
    }

    const totalLikedVideos = await Like.countDocuments({
        likedBy: new mongoose.Types.ObjectId(req.user?._id)
    })
    
    return res.status(200).json(new ApiResponse(200, {
        likedVideos,
        totalLikedVideos,
        currentPage: parseInt(page),
        totalPages: Math.ceil(totalLikedVideos / parseInt(limit))
    }, "Liked videos fetched successfully"))
} )

export { toggleVideoLike, toggleCommentLike, toggleTweetLike, getLikedVideos };