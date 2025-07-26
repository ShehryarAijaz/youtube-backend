import ApiResponse from "./ApiResponse";
import ApiError from "./ApiError";

const asyncHandler = (fn) => async (req, res, next) => {
    try{
        await fn(req, res, next)
        res.status(200).json(new ApiResponse(200, res.jsonData, res.jsonMessage))
    } catch (error) {
        res.status(500).json(new ApiError(error.code, error.message, error.errors, error.stack))
    }
}

export default asyncHandler;