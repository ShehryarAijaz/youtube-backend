import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
} from "../controllers/playlist.controller.js"

const router = Router();

router.route("/create-playlist").post(verifyJWT, createPlaylist)
router.route("/user-playlists/:userId").get(verifyJWT, getUserPlaylists)
router.route("/get-playlist/:playlistId").get(verifyJWT, getPlaylistById)
router.route("/add-video").post(verifyJWT, addVideoToPlaylist)
router.route("/remove-video").post(verifyJWT, removeVideoFromPlaylist)
router.route("/delete-playlist/:playlistId").delete(verifyJWT, deletePlaylist)
router.route("/update-playlist/:playlistId").put(verifyJWT, updatePlaylist)


export default router;