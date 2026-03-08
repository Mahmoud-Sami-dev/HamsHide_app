import mongoose from "mongoose";

export function connectDB() {
  mongoose
    .connect("mongodb://127.0.0.1:27017/saraha")
    .then(() => {
      console.log("DB connected successfully");
    })
    .catch((err) => {
      console.log("fail to connect to DB");
    });
}
