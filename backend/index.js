const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");


dotenv.config();
const app = express();

// database
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to mongodb"))
    .catch(err => console.log(err.message))

app.listen(process.env.PORT, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})