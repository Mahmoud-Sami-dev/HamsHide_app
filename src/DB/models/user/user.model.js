import { model, Schema } from "mongoose";
import { SYS_GENDER, SYS_ROLE } from "../../../common/index.js"; //shift + alt + O

const schema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 20,
      trim: true,
      uppercase: true,
    },
    email: {
      type: String,
      required: false,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    gender: {
      type: Number,
      enum: {
        values: Object.values(SYS_GENDER),
        message:
          "invalid gender value must be between 0-2, 0 for male, 1 for female, 2 for others",
      },
      default: SYS_GENDER.male,
    },
    role: {
      type: Number,
      enum: Object.values(SYS_ROLE),
      default: SYS_ROLE.user,
    },
    phoneNumber: {
      type: String,
      required: function () {
        if (this.email) return false;
        return true;
      },
    },
    otp: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
    // strict: false,
  },
);

export const User = model("User", schema);
