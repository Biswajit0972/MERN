import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
const userModel = Schema(
  {
    username: {
      type: String,
      required: [true, "username is required"],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      min: [8, "Minimum length of password should 8"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

userModel.methods.genarateRefreshToken = function () {
  
  return jwt.sign(
    {
      id: this._id,
    },
    process.env.SECARTE_KEY,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    }
  );
};

userModel.methods.genarateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      email: this.email,
    },
    process.env.SECARTE_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

export const User = mongoose.model("users", userModel);
