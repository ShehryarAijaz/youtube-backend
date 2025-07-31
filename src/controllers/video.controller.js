import { Video } from "../models/video.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"
import asyncHandler from "../utils/asyncHandler.js"
import mongoose from "mongoose"

const getAllVideos = asyncHandler( async(req, res) => {
    const {
        page = 1,
        limit = 10,
        query = '',
        sortBy = 'createdAt',
        sortType = 'desc',
        userId
    } = req.query

    const skip = (parseInt(page) - 1) * parseInt(limit)
    const sortOrder = sortType === 'asc' ? 1: -1

    const pipeline = []

    if (query) {
        pipeline.push({
            $match: {
                $or: [
                    { title: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            }
        })
    }

    if (userId) {
        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }

    // append count pipeline to the existing pipeline
    const countPipeline = [...pipeline, { $count: 'count' }]

    // execute the count pipeline
    const countResult = await Video.aggregate(countPipeline)

    // get the result of the count pipeline
    const total = countResult[0]?.count || 0

    // Sort
    pipeline.push({
        $sort: {
            [sortBy]: sortOrder
        }
    })

    pipeline.push(
        {
            $skip: skip
        },
        {
            $limit: parseInt(limit)
        }
    )

    // execute the pipeline
    const videos = await Video.aggregate(pipeline)

    // return the videos
    return res.status(200).
    json(new ApiResponse(200,
        {
            videos,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit),
            totalResults: total
        },
        "Videos fetched successfully"))
} )

const publishVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body

    if (!title || !description) {
        throw new ApiError(400, "All fields are required")
    }

    const videoLocalPath = req.files?.video?.[0]?.path
    const thumbnailLocalPath = req.files?.thumbnail?.[0]?.path

    if (!videoLocalPath) {
        throw new ApiError(400, "Video is required")
    }

    const videoUpload = await uploadOnCloudinary(videoLocalPath)
    const thumbnailUpload = await uploadOnCloudinary(thumbnailLocalPath)

    if (!videoUpload || !thumbnailUpload) {
        throw new ApiError(400, "Video or thumbnail upload failed")
    }

    // Set isPublished to true only if both uploads succeeded
    const isPublished = !!(videoUpload && thumbnailUpload);

    const video = await Video.create({
        videoFile: videoUpload.url,
        thumbnail: thumbnailUpload.url,
        owner: req.user._id,
        title,
        description,
        duration: videoUpload.duration,
        isPublished
    })

    if (!video) {
        throw new ApiError(400, "Failed to publish video")
    }

    return res.status(201).
        json(new ApiResponse(201, video, "Video published successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findById(
        new mongoose.Types.ObjectId(videoId)
    )

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).
    json(new ApiResponse(200, video, "Video fetched successfully"))
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const { title, description } = req.body
    
    if (!title || !description) {
        throw new ApiError(400, "All fields are required")
    }

    const video = await Video.findByIdAndUpdate(
        new mongoose.Types.ObjectId(videoId),
        {
            title,
            description
        },
        {
            new: true
        }
    )

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).
    json(new ApiResponse(200, video, "Video updated successfully"))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findByIdAndDelete(
        new mongoose.Types.ObjectId(videoId)
    )

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    return res.status(200).
    json(new ApiResponse(200, video, "Video deleted successfully"))
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    if (!videoId) {
        throw new ApiError(400, "Video ID is required")
    }

    const video = await Video.findById(new mongoose.Types.ObjectId(videoId))

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const updatedVideo = await Video.findByIdAndUpdate(
        new mongoose.Types.ObjectId(videoId),
        {
            isPublished: !video.isPublished
        },
        {
            new: true
        }
    )

    if (!updatedVideo) {
        throw new ApiError(400, "Failed to toggle publish status")
    }

    return res.status(200).
    json(new ApiResponse(200, updatedVideo, "Video publish status toggled successfully"))
})

export {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}