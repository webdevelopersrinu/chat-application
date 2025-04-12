// app.js
import express from "express";
import cors from "cors";
import xss from "xss-clean";
import helmet from "helmet";
import morgan from "morgan";
import sanitize from "express-mongo-sanitize";
import rateLimit from "express-rate-limit";
import http from "http";
import { Server } from "socket.io";

import globalErrorHandeler from "./utils/globalErrorHandeler.js";
import connectCloudinary from "./config/cloudinary.js";
import CustomError from "./utils/customError.js";

// Routes import
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

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }); // 100 requests per 15 minutes
app.use("/api", limiter);

connectCloudinary();

// Routes endpoints
app.use("/api/v1/user", userRoute);
app.use("/api/v1/chat", chatRoute);
app.use("/api/v1/message", messageRoute);

app.get("/", (req, res) => {
  res.status(200).send("api is working");
});

app.all("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/socket.io")) return next();
  const err = new CustomError(`This page ${req.originalUrl} is not found!`, 404);
  next(err);
});

app.use(globalErrorHandeler);

io.on("connection", (clientSocket) => {
  clientSocket.on("join-room", userId =>
    clientSocket.join(userId)
  )
  clientSocket.on("send-message", massges => {
    clientSocket.to(massges.members[0]).to(massges.members[1]).emit("recive-massage", massges)
  })
  
});

export default server; // Export the custom server instance

