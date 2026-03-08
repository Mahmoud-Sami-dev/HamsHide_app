import express from "express";
import { connectDB } from "./DB/connection.js";
import { authRouter, userRouter } from "./modules/index.js";
const app = express();
const port = 3000;

connectDB();

//parsing data from req
app.use(express.json());

//routing
app.use("/auth", authRouter);
app.use("/user", userRouter);
//global error handler middleware
app.use((error, req, res, next) => {
  if (error.message == "jwt expired")
    error.message = "token expired & please login again";
  return res
    .status(error.cause || 500)
    .json({ message: error.message, stack: error.stack, success: false });
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
