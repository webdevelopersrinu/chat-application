import JWT from "jsonwebtoken";
import crypto from "crypto";
import CustomError from "../../../utils/customError.js";
import users from "./../../../model/User.js";
import asyncError from "../../../utils/asyncError.js";

const passwordReset = asyncError(async (req, res, next) => {
  const resetToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await users.findOne({
    changePasswordResetToken: resetToken,
    changePasswordResetTokenExpaire: { $gt: Date.now() },
  });
  if (!user) {
    let err = new CustomError("invalid reset token or token is expaired!", 401);
    return next(err);
  }
  // change password
  const { password } = req.body;
  if (!password) {
    let err = new CustomError("provied password", 400);
    return next(err);
  }
  user.password = password;
  user.changePasswordResetToken = undefined;
  user.changePasswordResetTokenExpaire = undefined;
  user.passwordChangedAt = Date.now();
  await user.save();
  let token = JWT.sign({ id: user.id }, process.env.USER_SCRETE_STR, {
    expiresIn: process.env.LOGIN_EXPAIER,
  });
  res.status(200).json({
    massage:"Password Reset Succesfully",
    status: "success",
    token,
    name: user.name,
    email: user.email,
  });
});

export default passwordReset;
