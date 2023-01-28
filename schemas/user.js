const { model, Schema } = require("mongoose");
const Joi = require("joi");

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, "Set password for user"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ["starter", "pro", "business"],
    default: "starter",
  },
  token: String,
  avatarURL: {
    type: String,
    required: true,
  },
});

const registerSchema = Joi.object({
  subscription: Joi.string(),
  email: Joi.string().required(),
  password: Joi.string().required(),
 
});

const loginSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
 
});

const User = model("user", userSchema);

module.exports = { User, registerSchema, loginSchema };