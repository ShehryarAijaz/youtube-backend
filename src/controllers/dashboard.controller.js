import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { Video } from '../models/video.model.js';

const getChannelStats = asyncHandler( async(req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required")
    }

    const channelStats = await User.aggregate({
        $match: {
            username: username?.toLowerCase()
        },
        $lookup: {
            from: "videos",
            localField: "_id",
            foreignField: "owner",
            as: "videos",
        },
        $addFields: {
            videoCount: {
                $size: "$videos"
            }
        },
        $project: {
            username: 1,
            fullName: 1,
            avatar: 1,
            videoCount: 1
        }
    })

    if (!channelStats.length) {
        throw new ApiError(404, "Channel not found")
    }

    return res.status(200).json(new ApiResponse(200, channelStats[0], "Channel stats fetched successfully"))
} )

export { getChannelStats };
