const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    dp: {
        type: String,
        default: "https://res.cloudinary.com/dtxrrhfqj/image/upload/v1601053166/blank-profile-picture-973460_1280_pncp3w.webp"
    },
    followers:[{
        type: ObjectId,
        ref: "User"
    }],
    following: [{
        type: ObjectId,
        ref: "User"
    }],
    resetToken: String,
    expireToken: Date
})

mongoose.model("User", userSchema);