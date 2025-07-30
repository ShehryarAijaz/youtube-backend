import { User } from "../models/user.model.js";
import asyncHandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { env } from "../config/env.config.js";

export const verifyJWT = asyncHandler( async(req, _, next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.split(" ")[1]
    
        if (!token) {
            throw new ApiError(401, "Unauthorized")
        }
    
        const decoded = await jwt.verify(token, env.ACCESS_TOKEN_SECRET)
    
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

export const verifyRefreshToken = asyncHandler(async (req, res, next) => {
    try {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

        if (!incomingRefreshToken) {
            throw new ApiError(401, "Unauthorized request");
        }

        const decoded = await jwt.verify(incomingRefreshToken, env.REFRESH_TOKEN_SECRET);

        if (!decoded) {
            throw new ApiError(401, "Unauthorized request");
        }

        req.decodedRefreshToken = decoded;
        req.refreshToken = incomingRefreshToken;
        next();
    } catch (error) {
        throw new ApiError(500, "Something went wrong while verifying refresh token");
    }
});