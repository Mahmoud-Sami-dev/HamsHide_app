import express from "express";
import { connectDB } from "./DB/connection.js";
import { authRouter, messageRouter, userRouter } from "./modules/index.js";
import cors from "cors";
import { redisConnect } from "./DB/redis.connection.js";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
const app = express();
const port = 3000;

connectDB();
redisConnect();
app.use(cors("*")); // production
app.use("/uploads", express.static("uploads"));
app.use(helmet()); // set security headers

const limit = rateLimit({
  windowMs: 1 * 60 * 60 * 1000, // 1 hour
  limit: 3, // limit each IP to 3 requests per windowMs
  // statusCode:500,
  // message: "too many requests",
  handler: (req, res, next) => {
    throw new Error("too many requests", { cause: 429 });
  },
  keyGenerator: (req, res, next) => {
    return `${req.ip}:${req.path}`; // unique key for each IP and path combination
  },
});

app.use(limit); // apply rate limiting
//parsing data from req >> from body >> raw
app.use(express.json());

//routing
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/message", messageRouter);
app.get("/", (req, res, next) => {
  return res.send(`<h1>Hello</h1>`);
});
//global error handler middleware
app.use((error, req, res, next) => {
  if (error.message == "jwt expired")
    error.message = "token expired & please login again";
  return res.status(error.cause || 500).json({
    message: error.message,
    details: error.details?.length == 0 ? undefined : error.details,
    stack: error.stack,
    success: false,
  });
});

app.listen(port, () => {
  console.log("application is running on port", port);
});

// const encData = encryption("Mahmoud");
// console.log({ encData });
// const decData = decryption(
//   "bed033eb1a31cb2608d0b6190df0000d:40c1bafe05a127097a5405056f7fc64d",
// );
// console.log(decData);

//https://nassefm807-7801898.postman.co/workspace/Mahmoud-Sami-Nassef's-Workspace~2c8f71e3-56cd-43ad-874e-f48b10c4129c/collection/51125510-1793c4ac-77db-42ce-9e69-8b644beb144f?action=share&creator=51125510&active-environment=51125510-a6a01ba8-8aeb-4d6b-ac3f-555686cd98a7
