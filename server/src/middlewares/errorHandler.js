const { StatusCodes } = require("http-status-codes");
const config = require("../config/config");

const sendErrDev = (err, res) =>
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });

const sendErrProd = (err, res) => {
  if (!err.isOperational) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ status: "error", message: "Something went wrong!" });
  }

  res.status(err.statusCode).json({ status: err.status, message: err.message });
};

const errorHandler = (err, req, res, next) => {
  err.message = err.message || "Something went wrong!";
  err.statusCode = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  err.status = err.status || "error";

  console.log(err);
  if (config.env === "development") {
    sendErrDev(err, res);
  } else if (config.env === "production") {
    sendErrProd(err, res);
  }
};

module.exports = errorHandler;
