import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { env } from '../config/env.config.js';
import mongoose from 'mongoose';

const isProduction = env.NODE_ENV === "production"

const options = {
    httpOnly: true,
    secure: isProduction ? "Strict" : "Lax"
}

const generateTokens = async (userId) => {
    try{
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler( async(req, res) => {
    const { username, email, fullName, password } = req.body;

    if (!username || !email || !fullName || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User already exists")
    }
    
    const avatarLocalPath = req.files?.avatar?.[0]?.path
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path
    
    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatarUpload = await uploadOnCloudinary(avatarLocalPath)

    let coverImageUpload = null
    if (coverImageLocalPath) {
        coverImageUpload = await uploadOnCloudinary(coverImageLocalPath)
    }

    if (!avatarUpload) {
        throw new ApiError(400, "Avatar upload failed")
    }

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        password,
        avatar: avatarUpload.url,
        coverImage: coverImageUpload?.url || ""
    })

    const userData = await User.findById(user._id).select("-password -refreshToken")

    if (!userData) {
        throw new ApiError(500, "Something went wrong while creating user")
    }

    return res.status(201).json(new ApiResponse(201, userData, "User created successfully"))
    
} )

const loginUser = asyncHandler( async(req, res) => {
    const { username, email, password } = req.body;
    
    if (!username && !email || !password) {
        throw new ApiError(400, "Username or email and password are required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
        })

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isPasswordCorrect = await user.isPasswordCorrect(password)

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid password")
    }

    const { accessToken, refreshToken } = await generateTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    return res.status(200).
    cookie("accessToken", accessToken, options).
    cookie("refreshToken", refreshToken, options).
    json(new ApiResponse(200, { user: loggedInUser, accessToken }, "User logged in successfully"))
} )

const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1
            }
        },
        {
            new: true
        }
    )

    return res.status(200).
    clearCookie("accessToken", options).
    clearCookie("refreshToken", options).
    json(new ApiResponse(200, null, "User logged out successfully"))
} )

const refreshAccessToken = asyncHandler( async(req, res) => {
  
    const decoded = req.decodedRefreshToken

    const user = await User.findById(decoded._id)

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    const isRefreshTokenValid = user.refreshToken === req.refreshToken

    if (!isRefreshTokenValid) {
        throw new ApiError(401, "Unauthorized request")
    }

    const { newAccessToken, newRefreshToken } = await generateTokens(user._id)

    return res.status(200).
    cookie("accessToken", newAccessToken, options).
    cookie("refreshToken", newRefreshToken, options).
    json(new ApiResponse(200, { accessToken: newAccessToken, refreshToken: newRefreshToken }, "Access token refreshed successfully"))
} )

const changeCurrentUserPassword = asyncHandler( async(req, res) => {
    const { currentPassword, newPassword } = req.body;

    if (!(currentPassword || newPassword)) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findById(req.user?._id);

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordCorrect) {
        throw new ApiError(401, "Invalid current password")
    }

    user.password = newPassword;

    await user.save({ validateBeforeSave: false })

    return res.status(200).
    json(new ApiResponse(200, null, "Password changed successfully"))
} )

const getCurrentUser = asyncHandler( async(req, res) => {
    return res.status(200).
    json(new ApiResponse(200, req.user, "Current user fetched successfully"))
} )

const updateAccountDetails = asyncHandler( async(req, res) => {
    const { fullName, email } = req.body;

    if (!(fullName || email)) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                fullName,
                email
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).
    json(new ApiResponse(200, user, "Account details updated successfully"))
} )

const updateUserAvatar = asyncHandler( async(req, res) => {
    const avatarLocalPath = req.file?.path;
    const oldAvatar = req.user?.avatar;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatarUpload = await uploadOnCloudinary(avatarLocalPath);

    if (!avatarUpload) {
        throw new ApiError(400, "Avatar upload failed")
    }

    if (!oldAvatar) {
        throw new ApiError(400, "Old avatar not found")
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                avatar: avatarUpload?.url
            }
        },
        { new: true }
    ).select("-password -refreshToken")
    
    await deleteFromCloudinary(oldAvatar.split('/').pop().split('.')[0]);

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).
    json(new ApiResponse(200, { avatar: avatarUpload?.url }, "Avatar updated successfully"))
} )

const updateUserCoverImage = asyncHandler( async(req, res) => {
    const coverImageLocalPath = req.file?.path;
    const oldCoverImage = req.user?.coverImage;

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is required")
    }

    const coverImageUpload = await uploadOnCloudinary(coverImageLocalPath);
    
    if (!oldCoverImage) {
        throw new ApiError(400, "Old cover image not found")
    }
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImageUpload?.url
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    await deleteFromCloudinary(oldCoverImage.split('/').pop().split('.')[0]);

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).
    json(new ApiResponse(200, { coverImage: coverImageUpload?.url }, "Cover image updated successfully"))
} )

const getUserChannelProfile = asyncHandler( async(req, res) => {
    const { username } = req.params;

    if (!username?.trim()) {
        throw new ApiError(400, "Username is required")
    }

    const channel = await User.aggregate([
        {
            $match: {
                username: username?.toLowerCase()
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "channel",
                as: "subscribers"
            }
        },
        {
            $lookup: {
                from: "subscriptions",
                localField: "_id",
                foreignField: "subscriber",
                as: "subscribedTo"
            }
        },
        {
            $addFields: {
                subscribersCount: {
                    $size: "$subscribers"
                },
                subscribedToCount: {
                    $size: "$subscribedTo"
                },
                isSubscribed: {
                    $cond: {
                        if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                        then: true,
                        else: false
                    }
                }
            }
        },
        {
            $project: {
                fullName: 1,
                username: 1,
                email: 1,
                avatar: 1,
                coverImage: 1,
                subscribersCount: 1,
                subscribedToCount: 1,
                isSubscribed: 1,
                createdAt: 1
            }
        }
    ])

    if (!channel?.length) {
        throw new ApiError(404, "Channel not found")
    }

    return res.status(200).
    json(new ApiResponse(200, channel[0], "Channel profile fetched successfully"))
} )

const getWatchHistory = asyncHandler( async(req, res) => {
    const user = await User.aggregate([
        {
            $match: {
                _id: new mongoose.Types.ObjectId(req.user?._id.toString())
            }
        },
        {
            $lookup: {
                from: "videos",
                localField: "watchHistory",
                foreignField: "_id",
                as: "watchHistory",
                pipeline: [
                    {
                        $lookup: {
                            from: "users",
                            localField: "owner",
                            foreignField: "_id",
                            as: "owner",
                            pipeline: [
                                {
                                    $project: {
                                        fullName: 1,
                                        username: 1,
                                        avatar: 1,
                                    }
                                }
                            ]
                        }
                    },
                    {
                        $addFields: {
                            owner: {
                                $first: "$owner"
                            }
                        }
                    }
                ]
            }
        }
    ])

    if (!user?.length) {
        throw new ApiError(404, "Watch history not found")
    }

    return res.status(200).
    json(new ApiResponse(200, user[0].watchHistory, "Watch history fetched successfully"))
} )

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
};