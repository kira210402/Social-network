const User = require("../models/User");
const Post = require("../models/Post");
const Comment = require("../models/Comment");
const bcrypt = require("bcrypt");
const authController = require("./auth.controller");

const userController = {
    // get a user
    getUser: async (req, res) => {
        try {
            const user = new User.findById(req.params.id);
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // delete a user
    deleteUser: async (req, res) => {
        if(req.body.userId === req.params.id) {
            try {
                await User.findByIdAndDelete(req.params.id);
                res.status(200).json("User deleted")
            } catch (error) {
                res.status(500).json(error);
            }
        } else {
            res.status(403).json("You can only delete your account");
        }
    },

    // update a user
    updateUser: async (req, res) => {
        if(req.body.password) {
            try {
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);

            } catch (error) {
                return res.status(500).json(error);
            }
        }

        try {
            const user = await User.findByIdAndUpdate(
                req.params.id.trim(),
                {
                    $set: req.body,
                },
                {returnDocument: "after"}
            ).select("+password");
            const accessToken = await authController.generateAccessToken(user);
            if(req.body.profilePicture || req.body.theme) {
                try {
                    await Post.updateMany(
                        {userId: req.params.id},
                        {
                            $set: {avaUrl: req.body.profilePicture, theme: req.body.theme},
                        }
                    );
                    await Comment.updateMany(
                        {ownerId: req.params.id },
                        {
                            $set: {avaUrl: req.body.profilePicture, theme: req.body.theme},
                        }
                    );
                } catch (error) {
                    return res.status(500).json(err);
                }
            }
            const returnedUser = {
                ...user._doc,
                accessToken: accessToken,
            }
            res.status(200).json(returnedUser);
        } catch (error) {
            res.status(500).json(error);
        }
    },

    // follow a user
    followUser: async (req, res) => {
        if(req.body.userId !== req.params.id) {
            try {
                const user = await User.findById(req.params.id);
                // if user not follow yet
                if(!user.followers.includes(req.body.userId)) {
                    await User.findByIdAndUpdate(req.params.id, {
                        $push: {followers: req.body.userId},
                    });
                    const updatedUser = await User.findByIdAndUpdate(
                        req.body.userId,
                        {
                            $push: {followings: req.params.id},
                        },
                        { returnDocument: "after"}
                    );
                    return res.status(200).json(updatedUser);
                } else {
                    await User.findByIdAndUpdate(req.params.id, {
                        $pull: {followers: req.body.userId },
                    });
                    const updatedUser = await User.findByIdAndUpdate(
                        req.body.userId,
                        {
                            $pull: { followings: req.params.id},
                        },
                        {returnDocument: "after"}
                    );
                    return res.status(200).json(updatedUser);
                }
            } catch (error) {
                return res.status(500).json(error);
            }
        } else {
            return res.status(403).json("You can't follow yourself")
        }
    },

    // search for users
    searchAllUser: async(req, res) => {
        try {
            const username = req.query.username;
            const user = await User.find({username: {$regex: username}})
                .limit(2)
                .select("username profilePicture theme")
                .exec();
            return res.status(200).json(user);
        } catch (error) {
            return res.status(500).json(error);
        }
    },

    // get leader boards
    getLeaderBoard: async (req, res) => {
        try {
            const users = await User.find().sort({karmas: -1}).limit(10);
            res.status(200).json(users);
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}

module.exports = userController;