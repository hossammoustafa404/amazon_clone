require("dotenv").config();
const Joi = require("joi");

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().required().valid("development", "production"),
    PORT: Joi.number().required(),
    DATABASE_CONNECTION: Joi.string().required(),
    DATABASE_PASSWORD: Joi.string().required(),
    ACCESS_TOKEN_SECRET: Joi.string().required(),
    ACCESS_TOKEN_EXPIRES: Joi.string().required(),
    REFRESH_TOKEN_SECRET: Joi.string().required(),
    REFRESH_TOKEN_EXPIRES: Joi.string().required(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.validate(process.env);

if (error) {
  throw new Error(error.message);
}

const config = {
  env: envVars.NODE_ENV,
  server: {
    port: envVars.PORT,
  },
  db: {
    urL: envVars.DATABASE_CONNECTION,
    password: envVars.DATABASE_PASSWORD,
  },
  jwt: {
    accessToken: {
      secret: envVars.ACCESS_TOKEN_SECRET,
      expire: envVars.ACCESS_TOKEN_EXPIRES,
    },
    refreshToken: {
      secret: envVars.REFRESH_TOKEN_SECRET,
      expires: envVars.REFRESH_TOKEN_EXPIRES,
    },
  },
};

module.exports = config;
