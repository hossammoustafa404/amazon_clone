const { StatusCodes } = require("http-status-codes");
const User = require("../models/user.model");
const {
  NotFoundError,
  ConflictError,
  UnAuthorizedError,
  BadRequestError,
} = require("../utils/appErrors");
const exclude = require("../utils/exclude");
const pick = require("../utils/pick");

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
const updateUserInfoService = async (userId, currUserId, newUserInfo) => {
  if (userId === currUserId) {
    return { error: new BadRequestError("User id must not match admin id") };
  }

  const { firstName, lastName, email, password, confirmPassword } = newUserInfo;
  if (firstName || lastName || email || password || confirmPassword) {
    return { error: new UnAuthorizedError("Admin can update only role") };
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

const updateMyInfoService = async (userId, newUserInfo, role) => {
  if (role === "user") {
    if (newUserInfo.role) {
      return {
        error: new UnAuthorizedError("Only the admin can update role"),
      };
    }
  }

  if (role === "admin") {
    if (newUserInfo.role) {
      return { error: new BadRequestError("Admin can not update his role") };
    }
  }

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

// Delete my account
const deleteMyAccountService = async (userId) => {
  const user = await User.findOneAndDelete({ _id: userId });

  if (!user) {
    return { error: new NotFoundError("User has been deleted") };
  }

  return {
    statusCode: StatusCodes.OK,
    message: "Account has been deleted successfully",
  };
};

// Delete user account
const deleteUserAccountService = async (userId) => {
  const user = await User.findOneAndDelete({ _id: userId });

  if (!user) {
    return { error: new NotFoundError("User has been deleted") };
  }

  return {
    statusCode: StatusCodes.OK,
    message: "Account has been deleted successfully",
  };
};

module.exports = {
  getAllUsersService,
  getSingleUserService,
  updateMyInfoService,
  updateUserInfoService,
  deleteMyAccountService,
  deleteUserAccountService,
};
