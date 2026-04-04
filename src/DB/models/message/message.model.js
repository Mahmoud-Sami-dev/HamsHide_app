import { Schema, model } from "mongoose";
const schema = new Schema(
  {
    content: {
      type: String,
      minLength: 2,
      maxLength: 1000,
      required: function () {
        if (this.attachment.length == 0) return true;
        return false;
      },
    },
    attachment: { type: [String] },
    receiver: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);
export const Message = model("Message", schema);
