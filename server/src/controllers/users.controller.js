const {
  getAllUsersService,
  getSingleUserService,
  updateUserInfoService,
  deleteAccountService,
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

// Update user info
const updateUserInfo = async (req, res) => {
  let userId = "";

  const { role, _id } = req.user;
  if (role === "user") {
    userId = _id;
  } else if (role === "admin") {
    userId = req.params.userId;
  }

  let newUserInfo = req.body;

  if (role === "admin") {
    newUserInfo = pick(req.body, ["role"]);
  }

  const { error, statusCode, user } = await updateUserInfoService(
    userId,
    newUserInfo
  );

  if (error) {
    throw error;
  }

  res.status(statusCode).json({ user });
};

// Delete  user
const deleteUser = async (req, res) => {
  const { role, _id } = req.user;
  let userId = "";

  if (role === "user") {
    userId = _id;
  } else if (role === "admin") {
    userId = req.params.userId;
  }

  const { error, statusCode, message } = await deleteAccountService(userId);

  if (error) {
    throw error;
  }

  res.status(statusCode).json({ msg: message });
};

// Delete account from admin
// const deleteAccount = async (req, res) => {
//   const { userId } = req.params;
//   const { error, statusCode, message } = await deleteAccountService(userId);

//   if (error) {
//     throw error;
//   }

//   res.status(statusCode).json({ msg: message });
// };

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUserInfo,
  deleteUser,
};
