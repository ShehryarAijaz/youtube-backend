const asyncHandler = (fn) => async (req, res, next) => {
    try {
        await fn(req, res, next)
    } catch (error) {
        console.error('AsyncHandler Error:', error);
        next(error); // Pass error to error handling middleware
    }
}

export default asyncHandler;