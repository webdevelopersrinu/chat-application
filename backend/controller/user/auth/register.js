import JWT from "jsonwebtoken";
import asyncError from "../../../utils/asyncError.js";
import user from "../../../model/User.js";

export const register = asyncError(async (req, res, next) => {
  const userData = await user.create(req.body);
  const token = JWT.sign({ id: userData.id }, process.env.USER_SCRETE_STR, {
    expiresIn: process.env.LOGIN_EXPAIER,
  });
  res.status(201).json({
    status: true,
    message: "User Registor Succesfully",
    token,
    name: userData.firstname + " " + userData.lastname,
    email: userData.email,
  });
});
