require("express-async-errors");
const express = require("express");
const errorHandler = require("./middlewares/errorHandler");
const cookieParser = require("cookie-parser");
const authRoute = require("./routes/auth.route");
const usersRoute = require("./routes/users.route");

const app = express();

app.use(express.json());
app.use(cookieParser());

// app.use("/", (req, res) => {
//   res.send("Hello Amazon");
// });


// Routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/users", usersRoute);
app.use(errorHandler);

module.exports = app;
