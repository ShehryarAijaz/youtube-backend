import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';

const generateTokens = async (userId) => {
    try{
        const user = await User.findById(userId)

        if (user) {
            const accessToken = user.generateAccessToken()
            const refreshToken = user.generateRefreshToken()

            user.refreshToken = refreshToken
            await user.save({ validateBeforeSave: false })

            return { accessToken, refreshToken }
        }

        return null
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
    const { username, password } = req.body;
    console.log(username, password);
    
    if (!username || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findOne({
        $or: [{ username: username.toLowerCase() },
            { email: username.toLowerCase() }]
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

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
    cookie("accessToken", accessToken, { ...options, maxAge: 1000 * 60 * 15 }).
    cookie("refreshToken", refreshToken, { ...options, maxAge: 1000 * 60 * 60 * 24 * 30 }).
    json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"))
} )

const logoutUser = asyncHandler( async(req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res.status(200).
    clearCookie("accessToken", { ...options, maxAge: 0 }).
    clearCookie("refreshToken", { ...options, maxAge: 0 }).
    json(new ApiResponse(200, null, "User logged out successfully"))
} )

export { registerUser, loginUser, logoutUser };