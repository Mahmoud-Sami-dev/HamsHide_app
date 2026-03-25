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
    provider: {
      type: String,
      enum: ["google", "system"],
      default: "system",
    },
    password: {
      type: String,
      required: function () {
        if (this.provider == "google") return false;
        return true;
      },
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
    profilePic: String,
    isEmailVerified: {
      type: Boolean,
      default: true,
    },
    credentialsUpdatedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    strict: true,
    timestamps: true, // createdAt , updatedAt
    // versionKey: "doc_version" ,
    optimisticConcurrency: true,
  },
);

export const User = model("User", schema);
