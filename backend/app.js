import express from "express";
import cors from "cors";
import xss from "xss-clean";
import helmet from "helmet";
import morgan from "morgan";
import sanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";

import globalErrorHandeler from "./utils/globalErrorHandeler.js";
import connectCloudinary from "./config/cloudinary.js";
import CustomError from "./utils/customError.js";

// routes import
import userRoute from "./routes/user/userRoute.js";
import chatRoute from "./routes/chat/chatRoute.js";
import messageRoute from "./routes/message/messageRoute.js";

const app = express();

app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(sanitize());
app.use(xss());
app.use(morgan("dev"));
// rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }); // 100 requests per 15 minutes
app.use(limiter);

connectCloudinary();

// routs end points
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute)
app.use("/api/v1/message", messageRoute)


app.get("/", (req, res) => {
  res.status(200).send("api is working");
});

app.all("*", (req, res, next) => {
  let err = new CustomError(`this page ${req.originalUrl} is not found!`, 404);
  next(err);
});

app.use(globalErrorHandeler);

export default app;
