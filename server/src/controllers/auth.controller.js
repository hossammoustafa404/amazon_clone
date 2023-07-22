const config = require("../config/config");
const {
  registerService,
  loginService,
  refreshService,
  logoutService,
} = require("../services/auth.services");

// Register
const register = async (req, res) => {
  const { error, statusCode, user, accessToken, refreshToken } =
    await registerService(req.body);

  if (error) {
    throw error;
  }

  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: config.env === "production",
    })
    .json({ user, accessToken });
};

// Login
const login = async (req, res) => {
  const { error, statusCode, user, accessToken, refreshToken } =
    await loginService(req.body);

  if (error) {
    throw error;
  }

  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: config.env === "production",
    })
    .json({ user, accessToken });
};

// Refresh
const refresh = async (req, res) => {
  const { error, statusCode, accessToken, refreshToken } = await refreshService(
    req.cookies?.refreshToken
  );

  if (error) {
    throw error;
  }

  res
    .status(statusCode)
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: config.env === "production",
    })
    .json({ accessToken });
};

// Logout
const logout = async (req, res) => {
  const { error, statusCode, message } = await logoutService(
    req.cookies?.refreshToken
  );

  if (error) {
    throw error;
  }

  res
    .status(statusCode)
    .clearCookie("refreshToken", {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: config.env === "production",
    })
    .json({ msg: message });
};
module.exports = { register, login, refresh, logout };
