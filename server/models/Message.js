const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    conversationId: String,
    sender: String,
    text: String,
},
{ timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);



