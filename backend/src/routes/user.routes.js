import { Router } from "express";
import {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    changeCurrentUserPassword,
    getCurrentUser,
    updateAccountDetails,
    updateUserAvatar,
    updateUserCoverImage,
    getUserChannelProfile,
    getWatchHistory
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT, verifyRefreshToken } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        },
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
);

// login route
router.route("/login").post(loginUser);

// ---- SECURE ROUTES ----

// logout route
router.route("/logout").post(verifyJWT, logoutUser);

// refresh access token route
router.route("/refresh-access-token").post(verifyRefreshToken, refreshAccessToken);

// change password route
router.route("/change-password").post(verifyJWT, changeCurrentUserPassword);

// get current user route
router.route("/get-current-user").get(verifyJWT, getCurrentUser);

// update account details route
router.route("/update-account-details").patch(verifyJWT, updateAccountDetails);

// update avatar route
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

// update cover image route
router.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

// get user channel profile route
router.route("/get-user-channel-profile/:username").get(verifyJWT, getUserChannelProfile);

// get watch history route
router.route("/get-watch-history").get(verifyJWT, getWatchHistory);

export default router;