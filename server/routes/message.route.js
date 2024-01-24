const router = require("express").Router();
const middleware = require("../controllers/middleware.controller");
const controller = require("../controllers/message.controller");

// create a message
router.post(
    "/",
    middleware.verifyToken,
    controller.createMessage,
);

// get message
router.get(
    "/:conversationId",
    middleware.verifyToken,
    controller.getMessage
);

module.exports = router;