const express = require("express");
const router = express.Router();
const { wrapper, validator } = require("../../midWare/index");
const {
  register,
  login,
  getCurrent,
  logout,
} = require("../../controlers/auth");
const { registerSchema, loginSchema } = require("../../schemas/user");
const { authenticate } = require("../../midWare/auth");

router.post("/users/register", validator(registerSchema), wrapper(register));
router.post("/users/login", validator(loginSchema), wrapper(login));
router.get("/current", authenticate, wrapper(getCurrent));
router.post("/logout", authenticate, wrapper(logout));
module.exports = router;