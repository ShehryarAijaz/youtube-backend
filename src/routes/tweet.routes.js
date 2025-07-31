import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
} from "../controllers/tweet.controller.js"

const router = Router();

router.route("/create-tweet").post(verifyJWT, createTweet)
router.route("/user-tweets/:userId").get(verifyJWT, getUserTweets)
router.route("/update-tweet/:tweetId").patch(verifyJWT, updateTweet)
router.route("/delete-tweet/:tweetId").post(verifyJWT, deleteTweet)


export default router;