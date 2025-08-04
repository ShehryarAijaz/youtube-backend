import { Schema, model } from "mongoose";

const playlistSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 20
    },
    description: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 100
    },
    videos: [{
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true
    }],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true })

export const Playlist = model("Playlist", playlistSchema);