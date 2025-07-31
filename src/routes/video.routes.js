import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo
} from "../controllers/video.controller.js"
import { upload } from "../middlewares/multer.middleware.js"

const router = Router()

router.route("/all-videos").get(getAllVideos)
router.route("/publish-video").post(
    verifyJWT,
    upload.fields([
        {
            name: "videoFile",
            maxCount: 1
        },
        {
            name: "thumbnail",
            maxCount: 1
        }
    ]),
    publishVideo
)
router.route("/get-video/:videoId").get(getVideoById)
router.route("/update-video/:videoId").patch(verifyJWT, updateVideo)
router.route("/delete-video/:videoId").post(verifyJWT, deleteVideo)

export default router;