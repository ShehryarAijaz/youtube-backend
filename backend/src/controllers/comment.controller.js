import { Comment } from "../models/comment.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import mongoose from "mongoose";

const getVideoComments = asyncHandler(  async(req, res) => {
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (parseInt(page) -1) * parseInt(limit)

    const comments = await Comment.aggregate([
        {
            $match: {
                video: new mongoose.Types.ObjectId(videoId)
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
                from: "users",
                localField: "owner",
                foreignField: "_id",
                as: "owner"
            }
        },
        {
            $addFields: {
                owner: {
                    $first: "$owner"
                }
            }
        },
        {
            $project: {
                content: 1,
                createdAt: 1,
                'owner.username': 1,
                'owner.avatar': 1
            }
        }
    ])

    if (!comments.length) {
        return new ApiError(404, "No comments found")
    }

    const totalComments = await Comment.countDocuments({
        video: new mongoose.Types.ObjectId(videoId)
    })

    return res.status(200).
    json(new ApiResponse(200,
        {comments,
            totalComments,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalComments / parseInt(limit))
        },
        "Comments fetched successfully"))
} )

const addComment = asyncHandler(  async(req, res) => {
    const { videoId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.create({
        content,
        video: new mongoose.Types.ObjectId(videoId),
        owner: req.user._id
    })

    if (!comment) {
        throw new ApiError(500, "Something went wrong while adding comment")
    }

    return res.status(200).
    json(new ApiResponse(200, comment, "Comment added successfully"))
} )

const updateComment = asyncHandler(  async(req, res) => {
    const { commentId } = req.params;
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "Content is required")
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content: content
            }
        },
        {
            new: true
        }
    )

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    return res.status(200).
    json(new ApiResponse(200, comment, "Comment updated successfully"))
} )

const deleteComment = asyncHandler(  async(req, res) => {
    const { commentId } = req.params;
    
    const comment = await Comment.findByIdAndDelete(commentId)

    if (!comment) {
        throw new ApiError(404, "Comment not found")
    }

    return res.status(200).
    json(new ApiResponse(200, comment, "Comment deleted successfully"))
} )

export { getVideoComments, addComment, updateComment, deleteComment }