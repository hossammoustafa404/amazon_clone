const { BadRequestError, UnAuthorizedError } = require("../utils/appErrors");
const jwt = require("jsonwebtoken");
const config = require("../config/config");
const User = require("../models/user.model");
const { verifyToken } = require("../utils/tokens");

const protect = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    throw new BadRequestError("authorization header must be provided");
  }

  if (!authHeader.startsWith("Bearer ")) {
    throw new BadRequestError("authorization header must be a bearer token");
  }

  const token = authHeader.split(" ")[1];

  const {
    tokenDoc: { userId },
  } = await verifyToken(token, config.jwt.accessToken.secret);

  const user = await User.findOne({ _id: userId });

  if (!user) {
    throw new UnAuthorizedError("User has been deleted");
  }

  req.user = user;
  next();
};

module.exports = protect;
