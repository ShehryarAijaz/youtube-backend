import { Router } from "express";
import { registerUser, loginUser, logoutUser, refreshAccessToken, updateUserAvatar } from "../controllers/user.controller.js";
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
router.route("/login").post(loginUser);

// secure routes
router.route("/logout").post(verifyJWT, logoutUser);
router.route("/refresh-access-token").post(verifyRefreshToken, refreshAccessToken);
router.route("/update-avatar").post(verifyJWT, upload.single("avatar"), updateUserAvatar);

export default router;