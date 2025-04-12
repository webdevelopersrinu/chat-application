import asyncError from "../../../utils/asyncError.js";
import CustomError from "../../../utils/customError.js";
import user from "../../../model/User.js";
import JWT from "jsonwebtoken";

export const login = asyncError(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    let err = new CustomError("Please enter your email and password!", 400);
    return next(err);
  }
  const isUser = await user.findOne({ email }).select("+password");
  if (!isUser) {
    let err = new CustomError("User not found with this email", 404);
    return next(err);
  }
  const isPasswordMatch = await isUser.compairePassword(password);
  if (!isPasswordMatch) {
    let err = new CustomError("Incorrect password!", 400);
    return next(err);
  }
  const token = JWT.sign({ id: isUser.id }, process.env.USER_SCRETE_STR, {
    expiresIn: process.env.LOGIN_EXPAIER,
  });
  res.status(200).json({
    message: "User Login Succesfully",
    status: true,
    token,
    name: isUser.firstname + " " + isUser.lastname,
    email: isUser.email,
  });
});
