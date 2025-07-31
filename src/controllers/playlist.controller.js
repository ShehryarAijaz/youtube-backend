import asyncHandler from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import mongoose from "mongoose";

const createPlaylist = asyncHandler( async(req, res) => {
    const { name, description } = req.body

    if (!(name || description)) {
        throw new ApiError(400, "Name and description are required")
    }

    const video = await Video.findById(new mongoose.Types.ObjectId(Video.videoId))

    if (!video) {
        throw new ApiError(404, "Video not found")
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: [new mongoose.Types.ObjectId(Video.videoId)],
        owner: req.user._id
    })

    if (!playlist) {
        throw new ApiError(500, "Something went wrong while creating the playlist")
    }

    return res.status(201).
    json(new ApiResponse(201, playlist, "Playlist created successfully"))
} )

const getUserPlaylists = asyncHandler( async(req, res) => {
    const { userId } = req.params

    if (!userId) {
        throw new ApiError(400, "User ID is required")
    }
    const playlists = await Playlist.find(
        {
            owner: new mongoose.Types.ObjectId(userId),
        }
    )

    if (!playlists) {
        throw new ApiError(404, "No playlists found")
    }

    return res.status(200).
    json(new ApiResponse(200, playlists, "Playlists fetched successfully"))
} )

const getPlaylistById = asyncHandler( async(req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required")
    }

    const playlist = await Playlist.findById(
        new mongoose.Types.ObjectId(playlistId)
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).
    json(new ApiResponse(200, playlist, "Playlist fetched successfully"))
} )

const addVideoToPlaylist = asyncHandler( async(req, res) => {
    const { playlistId, videoId } = req.body
    
    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist ID and video ID are required")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        new mongoose.Types.ObjectId(playlistId),
        {
            $addToSet: {
                videos: {
                    $each: [new mongoose.Types.ObjectId(videoId)]
                }
            }
        },
        {
            new: true
        }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).
    json(new ApiResponse(200, playlist, "Video added to playlist successfully"))
} )

const removeVideoFromPlaylist = asyncHandler( async(req, res) => {
    const { playlistId, videoId } = req.body

    if (!playlistId || !videoId) {
        throw new ApiError(400, "Playlist ID and video ID are required")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        new mongoose.Types.ObjectId(playlistId),
        {
            $pull: {
                videos: new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            new: true
        }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).
    json(new ApiResponse(200, playlist, "Video removed from playlist successfully"))
} )

const deletePlaylist = asyncHandler( async(req, res) => {
    const { playlistId } = req.params

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required")
    }

    const playlist = await Playlist.findByIdAndDelete(
        new mongoose.Schema.ObjectId(playlistId),
        {
            $unset: {
                videos: 1
            }
        }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).
    json(new ApiResponse(200, playlist, "Playlist deleted successfully"))
} )

const updatePlaylist = asyncHandler( async(req, res) => {
    const { playlistId } = req.params
    const { name, description } = req.body

    if (!playlistId) {
        throw new ApiError(400, "Playlist ID is required")
    }

    const playlist = await Playlist.findByIdAndUpdate(
        new mongoose.Types.ObjectId(playlistId),
        {
            $set: {
                name: name,
                description: description
            },
        },
        {
            new: true
        }
    )

    if (!playlist) {
        throw new ApiError(404, "Playlist not found")
    }

    return res.status(200).
    json(new ApiResponse(200, playlist, "Playlist updated successfully"))
} )

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}