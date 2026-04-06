import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js";

export const userMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Unauthorized — no token provided");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_USER_SECRET);
  } catch {
    throw new ApiError(401, "Unauthorized — invalid or expired token");
  }

  const user = await User.findById(decoded._id).select("-password");
  if (!user) throw new ApiError(401, "Unauthorized — user not found");

  req.user = user;
  next();
});
