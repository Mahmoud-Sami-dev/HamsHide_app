import express from "express";
import { connectDB } from "./DB/connection.js";
import { authRouter, userRouter } from "./modules/index.js";
import { decryption, encryption } from "./common/utils/encryption.utils.js";
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
