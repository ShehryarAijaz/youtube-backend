import { Router } from "express"
import { verifyJWT } from "../middlewares/auth.middleware.js"
import {
    getAllVideos,
    publishVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
} from "../controllers/video.controller.js"

const router = Router()

router.route("/all-videos").get(getAllVideos)
router.route("/publish-video").post(verifyJWT, publishVideo)
router.route("/get-video/:videoId").get(getVideoById)
router.route("/update-video/:videoId").patch(verifyJWT, updateVideo)
router.route("/delete-video/:videoId").post(verifyJWT, deleteVideo)
router.route("/toggle-publish/:videoId").post(verifyJWT, togglePublishStatus)

export default router;