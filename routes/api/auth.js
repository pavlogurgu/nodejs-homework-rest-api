const express = require("express");
const router = express.Router();
const { wrapper, validator } = require("../../midWare/index");
const {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
} = require("../../controlers/auth");
const { registerSchema, loginSchema } = require("../../schemas/user");
const { authenticate } = require("../../midWare/auth");
const multer = require("multer");
const path = require("path");

const multerConfig = multer.diskStorage({
  destination: path.join(__dirname, "../", "temp"),
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage: multerConfig,
});

router.post("/users/register", validator(registerSchema), wrapper(register));
router.post("/users/login", validator(loginSchema), wrapper(login));
router.get("/current", authenticate, wrapper(getCurrent));
router.post("/logout", authenticate, wrapper(logout));
router.patch(
  "/avatars",
  authenticate,
  upload.single("avatar"),
  wrapper(updateAvatar)
);
module.exports = router;