import { Schema, model } from "mongoose";

const tweetSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    content: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 280
    }
}, { timestamps: true })

const Tweet = model("Tweet", tweetSchema);

export default Tweet;