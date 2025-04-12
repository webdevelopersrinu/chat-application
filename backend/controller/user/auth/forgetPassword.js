import SendMail from "../../../config/sendMail.js";
import asyncError from "../../../utils/asyncError.js";
import CustomError from "../../../utils/customError.js";
import users from "./../../../model/User.js";

const forgetPassword = asyncError(async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    let err = new CustomError("provied your email", 400);
    return next(err);
  }
  // get the user in posted email
  let userData = await users.findOne({ email });
  if (!userData) {
    let err = new CustomError("Email is not exsite account!", 401);
    return next(err);
  }
  // genaret token
  let resetToken = userData.createPasswordResetToken();
  await userData.save({ validateBeforeSave: false });
  // send email
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/users/password-reset/${resetToken}`;
  try {
    await SendMail({
      sendeName: "Reset Your Password",
      senderEMail: "srinud974@gmail.com",
      receiverEMail: email,
      subject: "Reset Your Password",
      resetLink: resetUrl,
    });
    res.status(200).json({
      status: true,
      message: "password reset token send successfully",
    });
  } catch (err) {
    userData.changePasswordResetToken = undefined;
    userData.changePasswordResetTokenExpaire = undefined;
    userData.save({ validateBeforeSave: false });
    let message =
      "there was an error sending password reset! place try angain leter....";
    return next(new CustomError(message, 500));
  }
});

export default forgetPassword;
