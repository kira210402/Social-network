const router = require("express").Router();
const middleware = require("../controllers/middleware.controller");
const controller = require("../controllers/conversation.controller");

// create a conversation
router.post(
    "/",
    middleware.verifyToken,
    controller.createConversation
);

// get conversation of a user
router.get(
    "/:userId",
    middleware.verifyToken,
    controller.getConversation
);

// get available conversations between user
router.get(
    "/find/:first/:second",
    middleware.verifyToken,
    controller.getAvailableConversation
)

module.exports = router;