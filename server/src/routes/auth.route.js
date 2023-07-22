const {
  register,
  login,
  refresh,
  logout,
} = require("../controllers/auth.controller");
const validate = require("../middlewares/validate");
const {
  registerSchema,
  loginSchema,
} = require("../utils/validators/auth.schema");

const router = require("express").Router();

router.post("/register", validate(registerSchema), register);
router.post("/login", validate(loginSchema), login);
router.get("/refresh", refresh);
router.delete("/logout", logout);

module.exports = router;
