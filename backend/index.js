const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const route = require("./routes/index.route");


dotenv.config();
const app = express();

// database
mongoose.connect(process.env.MONGODB_URL)
    .then(() => console.log("Connected to mongodb"))
    .catch(err => console.log(err.message))

//
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({
    limit: "50mb",
    extended: true,
    parameterLimit: 50000,
}));
app.use(cors());
app.use(cookieParser());
app.use(helmet());
app.use(morgan("common"));

// routes
route(app);


app.listen(process.env.PORT || 8000, () => {
    console.log(`Server running on port ${process.env.PORT}`);
})