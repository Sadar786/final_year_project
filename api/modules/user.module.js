import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
    profilePicture : {
        type: String,
    },
    isAdmin:{
        type: Boolean,
        default: false,
    },
    haveAShop:{
        type: Boolean,
        default: false
    }
},
    { timestamps: true }

)

const User = mongoose.model("User", userSchema)
export default User;