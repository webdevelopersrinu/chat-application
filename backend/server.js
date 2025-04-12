// server.js
import "dotenv/config";
import server from "./app.js"; // now this is the HTTP server with Socket.io attached
import mongoose from "mongoose";
import winston from "winston";

mongoose
  .connect(process.env.DB_CON_STR)
  .then(() => console.log("db Conection is success..."))
  .catch(() => console.log("db Conection is not success something went worng..."));

const PORT = process.env.PORT || 5678;
server.listen(PORT, () => {
  console.log("server start runing....");
});

// const logger = winston.createLogger({
//   level: "error",
//   transports: [
//     new winston.transports.Console(),
//     new winston.transports.File({ filename: "error.log" }),
//   ],
// });

process.on("unhandledRejection", (err) => {
  logger.error(`Error: ${err.message}\nStack: ${err.stack}`);
  server.close(() => process.exit(1));
});
