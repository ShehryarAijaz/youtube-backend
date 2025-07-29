import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import ApiError from "../utils/ApiError.js";

export const verifyJWT = asyncHandler( async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1]
    
        if (!token) {
            throw new ApiError(401, "Unauthorized")
        }
    
        const decoded = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        if (!decoded) {
            throw new ApiError(401, "Unauthorized")
        }
    
        const user = await User.findById(decoded._id).select("-password -refreshToken")
    
        if (!user) {
            throw new ApiError(401, "Unauthorized")
        }
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(500, "Something went wrong while verifying JWT")
    }
} )