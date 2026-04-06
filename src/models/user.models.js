import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: 
    { 
      type: String, 
      required: true, 
      minlength: 6 
    },
    firstName:{ 
      type: String,
      required: true, 
      trim: true 
    },
    lastName: { 
      type: String, 
      trim: true 
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateToken = function () {
  return jwt.sign(
    { _id: this._id, email: this.email },
    process.env.JWT_USER_SECRET,
    { expiresIn: process.env.JWT_USER_EXPIRY }
  );
};

export const User = mongoose.model("User", userSchema);
