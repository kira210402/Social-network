const router = require("express").Router();
const middleware = require("../controllers/middleware.controller");
const controller = require("../controllers/user.controller");

// update a user
router.put("/:id", middleware.verifyTokenAndUserAuthorization, controller.updateUser);

// delete a user
router.delete("/:id", middleware.verifyTokenAndUserAuthorization, controller.deleteUser);

// get a user
router.get("/:id", middleware.verifyToken, controller.getUser);

// get leader board users
router.get("/:id/leaderboard", middleware.verifyToken, controller.getLeaderBoard);

// follow a user
router.put("/:id/follow", middleware.verifyToken, controller.followUser);

// search for users
router.get("/", middleware.verifyToken, controller.searchAllUser);


module.exports = router;