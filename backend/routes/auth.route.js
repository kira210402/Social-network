const router = require("express").Router();
const controller = require("../controllers/auth.controller");
const middleware = require("../controllers/middleware.controller");

// register
router.post("/register", controller.registerUser);

// refresh token
router.post("/refresh", controller.requestRefreshToken);

// log in
router.post("/login", controller.loginUser);

// log out
router.post("/logout", middleware.verifyToken, controller.logOut);

module.exports = router;