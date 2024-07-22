import mongoose from "mongoose";

const commentSchema = mongoose.Schema(
    {
        content:{
            type: String,
            require: true,
        },
        postId:{
            type: String,
            require: true,
        },
        userId: {
            type: String,
            require: true
        },
        likes: {
            type: Array,
            default: [],
        },
        numberOfLikes:{
            type: Number,
            default: 0,
        },
        
    },
    {
        timestamps: true
    }
)

const comment = mongoose.model('Comment', commentSchema);

export default comment;