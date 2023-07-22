const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const { ConflictError, UnAuthorizedError } = require("../utils/appErrors");
const { generateAuthTokens, verifyToken } = require("../utils/tokens");
const config = require("../config/config");
const tokenModel = require("../models/token.model");
const tokenTypes = require("../config/tokens");

// Register
const registerService = async (userData) => {
  const isEmailTaken = await User.isEmailTaken(userData.email);

  if (isEmailTaken) {
    return { error: new ConflictError("Email is taken", 409) };
  }

  let user = await User.create(userData);
  user = await User.findOne({ _id: user._id });

  const { accessToken, refreshToken } = await generateAuthTokens(user);

  return { statusCode: StatusCodes.OK, user, accessToken, refreshToken };
};

// Login
const loginService = async (userData) => {
  const { email, password } = userData;

  let user = await User.findOne({ email });

  if (!user) {
    return { error: new UnAuthorizedError("Wrong email") };
  }

  const isPassMatch = await User.comparePass(user._id, password);

  if (!isPassMatch) {
    return { error: new UnAuthorizedError("Wrong password") };
  }

  user = await User.findOne({ email });

  const { accessToken, refreshToken } = await generateAuthTokens(user);

  return { statusCode: StatusCodes.OK, user, accessToken, refreshToken };
};

// Refresh
const refreshService = async (refToken) => {
  if (!refToken) {
    return {
      error: new UnAuthorizedError(
        "No refresh token provided. User may be logged out or deleted"
      ),
    };
  }
  const {
    tokenDoc: { userId },
  } = await verifyToken(refToken, config.jwt.refreshToken.secret);

  const user = await User.findOne({ _id: userId });

  if (!user) {
    return { error: new UnAuthorizedError("User is deleted") };
  }

  const { accessToken, refreshToken } = await generateAuthTokens(user);

  return { statusCode: StatusCodes.OK, accessToken, refreshToken };
};

// Logout
const logoutService = async (refToken) => {
  if (!refToken) {
    return {
      error: new UnAuthorizedError(
        "No refresh token provided. User may be logged out or deleted"
      ),
    };
  }

  const {
    tokenDoc: { userId },
  } = await verifyToken(refToken, config.jwt.refreshToken.secret);

  const deletedReport = await tokenModel.deleteMany({
    $or: [
      { type: tokenTypes.ACCESS, userId },
      { type: tokenTypes.REFRESH, userId },
    ],
  });

  if (!deletedReport.deletedCount) {
    return {
      error: new UnAuthorizedError("User may be logged out or deleted"),
    };
  }

  return {
    statusCode: StatusCodes.OK,
    message: "User has logged out successfuly",
  };
};

module.exports = {
  registerService,
  loginService,
  refreshService,
  logoutService,
};
