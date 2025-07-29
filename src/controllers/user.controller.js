import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import { User } from '../models/user.model.js';
import uploadOnCloudinary from '../utils/cloudinary.js';

const registerUser = asyncHandler( async(req, res) => {
    const { username, email, fullName, password } = req.body;
    console.log(username, email, fullName, password);

    if (!username || !email || !fullName || !password) {
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if (existingUser) {
        throw new ApiError(409, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required")
    }

    const avatarUpload = await uploadOnCloudinary(avatarLocalPath)
    const coverImageUpload = await uploadOnCloudinary(coverImageLocalPath)

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

} )

export { registerUser, loginUser };