const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    userId: { type: String, required: true, },
    username: String,
    avaUrl: String,
    imageUrl: String,
    cloudinaryId: String,
    title: {
        type: String,
        required: true,
        minLength: 10,
        maxLength: 100,
    },
    description: {
        type: String,
        required: true,
        minLength: 4,
    },
    tags: {
        type: Number,
        required: true,
        default: 0,
    },
    upvotes: {
        type: Array,
        default: [], 
    },
    downvotes: {
        type: Array,
        default: [], 
    },
    comments: {
        type: Number,
        default: 0,
    },
},
{ timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);



