import mongoose from 'mongoose';
import { ApiError } from '../utils/ApiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { Video } from '../models/video.model.js';
import { Playlist } from '../models/playlist.model.js';
import { Tweet } from '../models/tweet.model.js';
import { Subscription } from '../models/subscription.model.js';
import { Like } from '../models/like.model.js';
import { Comment } from '../models/comment.model.js';

const getChannelStats = asyncHandler( async(req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required")
    }

    // The previous aggregation only counted the number of videos (videoCount).
    // To get the total views of all videos for the channel, we need to sum the views of all their videos.

    // Aggregate channel stats: total video views, total subscribers, total videos, total likes, total comments, total playlists, total tweets
    const channelStats = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        // Get videos for the user
        {
            $lookup: {
                from: "videos",
                localField: "_id",
                foreignField: "owner",
                as: "videos"
            }
        },
        // Get playlists for the user
        {
            $lookup: {
                from: "playlists",
                localField: "_id",
                foreignField: "owner",
                as: "playlists"
            }
        },
        // Get tweets for the user
        {
            $lookup: {
                from: "tweets",
                localField: "_id",
                foreignField: "owner",
                as: "tweets"
            }
        },
        // Get subscribers for the user (subscriptions where channelId is this user)
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        // Get likes for the user's videos
        {
            $lookup: {
                from: "likes",
                let: { videoIds: "$videos._id" },
                pipeline: [
                    { $match: { $expr: { $in: ["$video", "$$videoIds"] } } }
                ],
                as: "videoLikes"
            }
        },
        // Get comments for the user's videos
        {
            $lookup: {
                from: "comments",
                let: { videoIds: "$videos._id" },
                pipeline: [
                    { $match: { $expr: { $in: ["$video", "$$videoIds"] } } }
                ],
                as: "videoComments"
            }
        },
        {
            $addFields: {
                totalVideos: { $size: "$videos" },
                totalViews: {
                    $sum: {
                        $map: {
                            input: "$videos",
                            as: "video",
                            in: { $ifNull: ["$$video.views", 0] }
                        }
                    }
                },
                totalSubscribers: { $size: "$subscribers" },
                totalLikes: { $size: "$videoLikes" },
                totalComments: { $size: "$videoComments" },
                totalPlaylists: { $size: "$playlists" },
                totalTweets: { $size: "$tweets" }
            }
        },
        {
            $project: {
                username: 1,
                fullName: 1,
                avatar: 1,
                totalVideos: 1,
                totalViews: 1,
                totalSubscribers: 1,
                totalLikes: 1,
                totalComments: 1,
                totalPlaylists: 1,
                totalTweets: 1
            }
        }
    ]);

    if (!totalViews.length) {
        throw new ApiError(404, "Channel not found")
    }

    return res.status(200).json(new ApiResponse(200, totalViews[0], "Channel stats fetched successfully"))
} )

const getChannelVideos = asyncHandler( async(req, res) => {
    const { username } = req.params

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required")
    }

    const channelVideos = await Video.aggregate([
        {
            $match: {
                owner: username?.toLowerCase()
            }
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
            $unwind: "$owner"
        },
        {
            $project: {
                _id: 1,
                title: 1,
                description: 1,
                thumbnail: 1,
                duration: 1,
                views: 1,
                createdAt: 1,
                owner: {
                    _id: 1,
                    username: 1,
                    fullName: 1,
                    avatar: 1
                }
            }
        }
    ])

    if (!channelVideos.length) {
        throw new ApiError(404, "No videos found")
    }

    return res.status(200).json(new ApiResponse(200, channelVideos, "Channel videos fetched successfully"))
})

export { getChannelStats, getChannelVideos };
