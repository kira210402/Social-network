const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const authController = {
    // register
    registerUser: async (req, res) => {
        if (req.body.password.length > 7) {
            try {
                const salt = await bcrypt.genSalt(10);
                const hashed = await bcrypt.hash(req.body.password, salt);

                // create a new user
                const newUser = await new User({
                    username: req.body.username,
                    email: req.body.email,
                    password: hashed,
                });

                // save user to DB
                const user = await newUser.save();
                res.status(200).json(user);
            } catch (error) {
                res.status(500).json(err.message);
            }
        } else {
            res.status(401).json({ message: "Must be more than 7 characters" })
        }
    },

    generateAccessToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_KEY,
            { expiresIn: "365d" }
        );
    },

    generateRefreshToken: (user) => {
        return jwt.sign(
            {
                id: user.id,
                isAdmin: user.isAdmin,
            },
            process.env.JWT_KEY,
            { expiresIn: "365d" }
        );
    },

    // login
    loginUser: async (req, res) => {
        try {
            const user = await User.findOne({
                username: req.body.username
            }).select("+password");

            if (!user) {
                return res.status(404).json({ message: "Incorrect username" });
            }

            const validPassword = await bcrypt.compare(
                req.body.password,
                user.password
            );

            if (!validPassword) {
                return res.status(404).json({ message: "Incorrect password" });
            } else if (user && validPassword) {
                // generate access token
                const accessToken = this.authController.generateAccessToken(user);
                // generate refresh token
                const refreshToken = this.authController.generateRefreshToken(user);

                // store refresh token in cookie
                res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    path: "/",
                    sameSite: "none",
                });

                const returnedUser = {
                    ...user._doc,
                    accessToken: accessToken,
                };
                res.status(200).json(returnedUser);
            }
        } catch (error) {
            res.status(500).json(error);
        }
    },

    requestRefreshToken: async (req, res) => {
        // take refresh token from user
        const refreshToken = req.cookies.refreshToken;

        // send error if token is not valid
        if (!refreshToken) return res.status(401).json("You are not authenticated");

        jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY, (err, user) => {
            if (err) {
                console.log(err);
            }

            // create new access token, refresh token and send to user
            const newAccessToken = this.authController.generateAccessToken(user);
            const newRefreshToken = this.authController.generateRefreshToken(user);

            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                secure: true,
                path: "/",
                sameSite: "strict",
            });
            res.status(200).json({
                accessToken: newAccessToken,
                refreshToken: newRefreshToken,
            });
        });
    },

    // log out
    logOut: async (req, res) => {
        // clear cookies when user logs out
        res.clearCookie("refreshToken");
        res.status(200).json("Logged out successfully!");
    }
}

module.exports = authController;