import JWT from "jsonwebtoken";
import asyncError from "../utils/asyncError.js";
import CustomError from "../utils/customError.js";
import User from "../model/User.js";


const userAuth = asyncError(async (req, res, next) => {
  let testToken = req.headers.authorization;
  let token;
  if (testToken && testToken.startsWith("Bearer")) {
    token = testToken.split(" ")[1];
  }
  token = token === "null" ? null : token;
  if (!token) {
    let err = new CustomError(
      "Please log in to access your account and view the information.",
      401
    );
    return next(err);
  }
  let decodeToken = JWT.verify(token, process.env.USER_SCRETE_STR);
  const isUser = await User.findById(decodeToken.id);
  if (!isUser) {
    let err = new CustomError(
      "Unauthorized access. Please log in to continue.",
      401
    );
    return next(err);
  }
  req.userId = isUser.id;
  // res.status(200).send("hiiiiiiiiiiii.....");
  next();
});

export default userAuth;

