const authRoute = require("./auth.route");
const conversationRoute = require("./conversation.route");
const messageRoute = require("./message.route");
const newsRoute = require("./news.route");
const postRoute = require("./post.route");
const userRoute = require("./user.route");

module.exports = (app) => {
    app.use("/auth", authRoute);
    app.use("/conversation", conversationRoute);
    app.use("/message", messageRoute);
    app.use("/news", newsRoute);
    app.use("/post", postRoute);
    app.use("/user", userRoute);
}