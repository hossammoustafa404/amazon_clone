const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const { NotFoundError, ConflictError } = require("../utils/appErrors");

// Get All Users
const getAllUsersService = async () => {
  const users = await User.find({});

  return { statusCode: StatusCodes.OK, nbHits: users.length, users };
};

// Get single user
const getSingleUserService = async (userId) => {
  const user = await User.findOne({ _id: userId });

  if (!user) {
    return { error: new NotFoundError("User is not found") };
  }

  return { statusCode: StatusCodes.OK, user };
};

// Update user info
const updateUserInfoService = async (userId, newUserInfo) => {
  if (newUserInfo.email) {
    const isEmailTaken = await User.isEmailTaken(newUserInfo.email);

    if (isEmailTaken) {
      return { error: new ConflictError("Email is taken") };
    }
  }

  const user = await User.findOneAndUpdate({ _id: userId }, newUserInfo, {
    new: true,
    runValidators: true,
  });

  if (!user) {
    return { error: new NotFoundError("User has been deleted") };
  }

  return { statusCode: StatusCodes.OK, user };
};

// Delete account
const deleteAccountService = async (userId) => {
  const rep = await User.findOneAndDelete({ _id: userId });
  console.log(rep);

  return {
    statusCode: StatusCodes.OK,
    message: "Account has been deleted successfully",
  };
};

module.exports = {
  getAllUsersService,
  getSingleUserService,
  updateUserInfoService,
  deleteAccountService,
};
