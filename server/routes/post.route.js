const router = require("express").Router();
const controller = require("../controllers/post.controller");
const middleware = require("../controllers/middleware.controller");
const commentController = require("../controllers/comment.controller");
const Post = require("../models/Post");
const upload = require("../utils/multer");

// create a post
router.post(
    "/",
    upload.single("image"),
    middleware.verifyToken,
    controller.createPost
);

// update a post
router.put(
    "/:id",
    middleware.verifyTokenAndUserPostAuthorization,
    controller.updatePost
);

// delete a post
router.delete(
    "/:id",
    middleware.verifyTokenAndUserPostAuthorization,
    controller.deletePost
);

// get a post
router.get("/fullpost/:id", middleware.verifyToken, controller.getAPost);

// get all post from a user
router.get(
    "/user/:id",
    middleware.verifyToken,
    controller.getPostsFromOne
);

// get all posts
router.get(
    "/",
    middleware.verifyToken,
    middleware.paginatedResult(Post),
    controller.getAllPosts
);

// get timeline post
router.post(
    "/timeline",
    middleware.verifyToken,
    controller.getFriendsPost
);

// upvote a post
router.put(
    "/:id/upvote",
    middleware.verifyToken,
    controller.upvotePost
);

// downvote a post
router.put(
    "/:id/downvote",
    middleware.verifyToken,
    controller.downvotePost,
);

// get a post to favorite
router.put(
    "/:id/favorite",
    middleware.verifyToken,
    controller.addFavoritePost
);

// add a comment
router.post(
    "/comment/:id",
    middleware.verifyToken,
    commentController.addComment
);

// get all comments
router.get(
    "/comments",
    middleware.verifyToken,
    commentController.getAllComments
);

// get favorite posts
router.get(
    "/favorites",
    middleware.verifyToken,
    controller.getFavoritePosts
);

// get all comments in a post
router.get(
    "/comment/:id",
    middleware.verifyToken,
    commentController.getCommentsInPost
);

// delete a comment
router.delete(
    "/comment/:id",
    middleware.verifyTokenAndCommentAuthorization,
    commentController.deleteComment
);


module.exports = router;
