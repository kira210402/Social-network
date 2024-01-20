const mongoose = require("mongoose");

const conversationSchema = new mongoose.Schema({
    members: Array,
    messageCount: {type: Number, default: 0 },

},
{ timestamps: true }
);

module.exports = mongoose.model("Conversation", conversationSchema);



