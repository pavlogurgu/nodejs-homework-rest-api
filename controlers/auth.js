const { User } = require("../schemas/user");
const { HttpError } = require("../midWare/index");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET_KEY } = process.env;
const fs = require("fs/promises");
const path = require("path");
const avatarDir = path.join(__dirname, "../../", "public", "avatars");
const gravatar = require("gravatar");
const sgMail = require("@sendgrid/mail");
const { SENDGRID_API_KEY } = process.env;
sgMail.setApiKey(SENDGRID_API_KEY);
const { v4: uuidv4 } = require("uuid");

const register = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new HttpError(409, "Email already registered");
  }
  const hashPassword = await bcrypt.hash(password, 10);

  const code = uuidv4();

  const letter = {
    to: email,
    from: "conopo2104@ibansko.com",
    subject: "verification",
    html: `<a href="http://localhost:3000/api/users/verify/${code}">Click here</a>`,
  };

  await sgMail.send(letter);

  const avatarURL = gravatar.url(email);
  const newUser = await User.create({ ...req.body, 
    password: hashPassword,
    subscription,
    avatarURL, });

  const result = {
    name: newUser.name,
    email: newUser.email,
  };
  res.json({
    status: "done",
    code: 201,
    data: result,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    throw new HttpError(401, "Email or password is invalid");
  }
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    throw new HttpError(401, "Invalid email or password");
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, SECRET_KEY);
  await User.findByIdAndUpdate(user._id, { token });
  const result = {
    token,
    name: user.name,
    email: user.email,
  };
  res.json({
    status: "done",
    code: 201,
    data: result,
  });
};

const getCurrent = async (req, res) => {
  const { email, name } = req.user;
  res.json({ email, name });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.json({ message: "Logout success" });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, filename } = req.file;
  const newName = `${_id}_${filename}`;
  const result = path.join(avatarDir, newName);
  await fs.rename(tempUpload, result);
  const imageUrl = path.join("avatars", newName);
  await User.findByIdAndUpdate(_id, { imageUrl });
  res.json({ imageUrl });
};



const verify = async (req, res) => {
  const { code } = req.params;
  const user = await User.findOne({ code });
  if (!user) {
    throw Error(404);
  }
  await User.findByIdAndUpdate(user._id, {
    verify: true,
    code: "",
  });
  res.json({ message: "Done" });
};

const verifyAgain = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new Error(401, `Error`);
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new Error(400, `Error`);
  }
  if (user.verify) {
    throw new Error(400, "Error");
  }

  const letter = {
    to: email,
    from: "conopo2104@ibansko.com",
    subject: "verification",
    html: `<a href="http://localhost:3000/api/users/verify/${user.verificationToken}">Click here</a>`,
  };

  await sgMail.send(letter);

  res.json({
    message: "Done",
  });
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateAvatar,
  verify,
  verifyAgain,
};