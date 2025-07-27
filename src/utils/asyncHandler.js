import ApiResponse from "./ApiResponse.js";
import ApiError from "./ApiError.js";

const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn(req, res, next)
        res.status(200).json(new ApiResponse(
            200,
            res.jsonData || null,
            res.jsonMessage || "Success"
        ))
    } catch (error) {
        res.status(500).json(new ApiError(
            error.code || 500,
            error.message || "Something went wrong",
            error.errors || null,
            error.stack || null
        ))
    }
}

export default asyncHandler;