const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    postId: String,
    ownerId: { type: String, required: true, },
    content: { type: String, required: true, },
    username: String,
    avaUrl: String,
    theme: String,
},
{ timestamps: true }
);

module.exports = mongoose.model("Comment", commentSchema);



