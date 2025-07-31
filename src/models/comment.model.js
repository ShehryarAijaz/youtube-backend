import { Schema, model } from "mongoose";

const commentSchema = new Schema({
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    },
    video: {
        type: Schema.Types.ObjectId,
        ref: "Video",
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
})

const Comment = model("Comment", commentSchema);

export default Comment;