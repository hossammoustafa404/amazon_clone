const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Token = require("../models/token.model");
const tokenTypes = require("../config/tokens");
const { UnAuthorizedError } = require("./appErrors");

// Generate
const generateAuthTokens = async (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, type: tokenTypes.ACCESS },
    config.jwt.accessToken.secret,
    {
      expiresIn: config.jwt.accessToken.expire,
    }
  );

  const refreshToken = jwt.sign(
    { userId: user._id, type: tokenTypes.REFRESH },
    config.jwt.refreshToken.secret,
    { expiresIn: config.jwt.refreshToken.expires }
  );

  await Token.deleteMany({
    $or: [
      { type: tokenTypes.ACCESS, userId: user._id },
      { type: tokenTypes.REFRESH, userId: user._id },
    ],
  });

  await Token.create({
    type: tokenTypes.ACCESS,
    token: accessToken,
    userId: user._id,
  });

  await Token.create({
    type: tokenTypes.REFRESH,
    token: refreshToken,
    userId: user._id,
  });

  return { accessToken, refreshToken };
};

// Verify
const verifyToken = async (token, secret) => {
  let payload = {};
  try {
    payload = jwt.verify(token, secret);
  } catch (error) {
    throw new UnAuthorizedError(error.message);
  }

  const tokenDoc = await Token.findOne({
    type: payload.type,
    token,
    userId: payload.userId,
  });

  if (!tokenDoc) {
    throw new UnAuthorizedError("Token does not exist in database");
  }
  return { payload, tokenDoc };
};

module.exports = { generateAuthTokens, verifyToken };
