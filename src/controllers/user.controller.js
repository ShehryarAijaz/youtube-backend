import asyncHandler from '../utils/asyncHandler.js';

const registerUser = asyncHandler( async(req, res) => {
    res.status(200).json({
        message: 'ok'
    })
} )

const loginUser = asyncHandler( async(req, res) => {
    res.send('<h1>Welcome to the login page</h1>')
    // res.status(200).json({
    //     message: 'ok'
    // })
} )

export { registerUser, loginUser };