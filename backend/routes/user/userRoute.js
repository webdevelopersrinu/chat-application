import express from "express";
import { register } from "../../controller/user/auth/register.js";
import { login } from "../../controller/user/auth/login.js";
import forgetPassword from "../../controller/user/auth/forgetPassword.js";
import passwordReset from "../../controller/user/auth/psswordReset.js";
import userAuth from "../../middleware/user.js";
import { getAllUsers, userInfo } from "../../controller/user/profiles/UserInfo.js";



const userRoute = express.Router();
userRoute.route("/singup").post(register);
userRoute.route("/login").post(login);
// userRoute.route("/hi").get(userAuth)
userRoute.route("/forget-password").patch(forgetPassword)
userRoute.route("/password-reset/:token").patch(passwordReset)
userRoute.route("/info").get(userAuth, userInfo)
userRoute.route("/all").get(userAuth, getAllUsers)

export default userRoute;
