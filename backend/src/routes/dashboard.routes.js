import {
    getChannelStats,
    getChannelVideos
} from "../controllers/dashboard.controller.js"
import { Router } from "express"

const router = Router()

router.get("/channel-stats/:username", getChannelStats)
router.get("/channel-videos/:username", getChannelVideos)

export default router