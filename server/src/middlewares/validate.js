const Joi = require("joi");
const { BadRequestError } = require("../utils/appErrors");
const pick = require("../utils/pick");

const validate = (schema) => (req, res, next) => {
  const inputsObj = pick(req, Object.keys(schema));

  const { error } = Joi.compile(schema).validate(inputsObj, {
    abortEarly: false,
  });

  if (error) {
    throw new BadRequestError(error.message);
  }

  next();
};

module.exports = validate;
