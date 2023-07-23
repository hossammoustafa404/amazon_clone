const { default: mongoose } = require("mongoose");
const {
  getAllUsersService,
  getSingleUserService,
  updateUserInfoService,
  deleteMyAccountService,
  deleteUserAccountService,
  updateMyInfoService,
} = require("../services/users.services");

const pick = require("../utils/pick");

// Get all users
const getAllUsers = async (req, res) => {
  const { error, statusCode, nbHits, users } = await getAllUsersService();

  if (error) {
    throw error;
  }

  res.status(statusCode).json({ nbHits, users });
};

// Get single user
const getSingleUser = async (req, res) => {
  const { userId } = req.params;
  const { error, statusCode, user } = await getSingleUserService(userId);

  if (error) {
    throw error;
  }

  res.status(statusCode).json({ user });
};

// Update my info
const updateMyInfo = async (req, res) => {
  const { _id: userId, role } = req.user;
  const newUserInfo = req.body;

  const { error, statusCode, user } = await updateMyInfoService(
    userId,
    newUserInfo,
    role
  );

  if (error) {
    throw error;
  }

  res.status(statusCode).json({ user });
};

// Update user info
const updateUserInfo = async (req, res) => {
  const { userId } = req.params;
  const currUserId = req.user._id.toString();

  const newUserInfo = req.body;

  const { error, statusCode, user } = await updateUserInfoService(
    userId,
    currUserId,
    newUserInfo
  );

  if (error) {
    throw error;
  }

  res.status(statusCode).json({ user });
};

// Delete  my account
const deleteMyAccount = async (req, res) => {
  const { _id: userId } = req.user;
  const { error, statusCode, message } = await deleteMyAccountService(userId);

  if (error) {
    throw error;
  }

  res.status(statusCode).json({ msg: message });
};

// Delete  user account
const deleteUserAccount = async (req, res) => {
  const { userId } = req.params;
  const { error, statusCode, message } = await deleteUserService(userId);

  if (error) {
    throw error;
  }

  res.status(statusCode).json({ msg: message });
};

module.exports = {
  getAllUsers,
  getSingleUser,
  updateMyInfo,
  deleteMyAccount,
  deleteUserAccount,
  updateMyInfo,
  updateUserInfo,
};
