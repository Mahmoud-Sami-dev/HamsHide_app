import { model, Schema, SchemaTypes } from "mongoose";

const schema = new Schema({
  token: String,
  userId: { type: SchemaTypes.ObjectId, ref: "User", required: true },
  expiresAt: {
    type: Date,
    index: { expires: 0 }, //ttl
  },
});

export const Token = model("Token", schema);
