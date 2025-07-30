import asyncHandler from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import { uploadOnCloudinary, deleteFromCloudinary } from '../utils/cloudinary.js';
import { env } from '../config/env.config.js';

const options = {
    httpOnly: true,
    secure: env.NODE_ENV === "production" || env.NODE_ENV === "development",
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
    console.log(username, password);
    
    if (!(username || email || password)) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({
        $or: [{ username }, { email }]
        })
    console.log(user);

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
    json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"))
} )

const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: undefined
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

    if (!coverImageLocalPath) {
        throw new ApiError(400, "Cover image is required")
    }

    const coverImageUpload = await uploadOnCloudinary(coverImageLocalPath);
    
    const user = await User.findByIdAndUpdate(
        req.user?._id,
        {
            $set: {
                coverImage: coverImageUpload?.url
            }
        },
        { new: true }
    ).select("-password -refreshToken")

    if (!user) {
        throw new ApiError(404, "User not found")
    }

    return res.status(200).
    json(new ApiResponse(200, { coverImage: coverImageUpload?.url }, "Cover image updated successfully"))
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
    updateUserCoverImage
};