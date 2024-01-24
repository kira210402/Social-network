const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");


const commentController = {
    // add a comment
    addComment: async(req, res) => {
        try {
            const user = await User.findById(req.body.ownerId);
            await Post.findOneAndUpdate(
                { _id: req.params.id },
                { $inc: { comments: 1 }}
            );
            const makeComment = {
                ...req.body,
                postId: req.params.id,
                username: user.username,
                avaUrl: user.profilePicture, 
                theme: user.theme,
            }

            const newComment = new Comment(makeComment);
            const savedComment = await newComment.save();
            res.status(200).json(savedComment);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // get all comments
    getAllComments: async(req, res) => {
        try {
            const comments = await Comment.find();
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // get all comments in a post
    getCommentsInPost: async(req, res) => {
        try {
            const comments = await Comment.find({ postId: req.params.id });
            res.status(200).json(comments);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // delete comment
    deleteComment: async(req, res) => {
        try {
            const comment = await Comment.findById(req.params.id);
            await Comment.findByIdAndDelete(req.params.id);
            await Post.findOneAndUpdate(
                { _id: comment.postId},
                { $inc: { comments: -2 }}
            );
            res.status(200).json("Delete comment successfully!")
        } catch (error) {
            res.status(500).json(error);
        }
    }
}

module.exports = commentController;