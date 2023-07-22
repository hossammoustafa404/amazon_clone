const { UnAuthorizedError } = require("../utils/appErrors");

const restrictedTo = (role) => (req, res, next) => {
  const { role: currRole } = req.user;

  if (role !== currRole) {
    throw new UnAuthorizedError(`You must be ${role}`);
  }

  next();
};

module.exports = restrictedTo;
