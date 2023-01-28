const { HttpError } = require("../midWare/index");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { SECRET_KEY } = process.env;
const { User } = require("../schemas/user");

const authenticate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    next(HttpError(401, "Email in use"));
  }

  try {
    const payload = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(payload.id);
    if (!user || !user.token || token !== String(user.token)) {
      next(HttpError(401, "Email in use"));
    }
    req.user = user;
    next();
  } catch (e) {
    next(HttpError(401, "Email in use"));
  }
};

module.exports = { authenticate };