import { Admin } from "../models/admin.models.js";
import jwt from "jsonwebtoken";
import { ApiError } from "../utils/api-errors.js";
import { asyncHandler } from "../utils/async-handler.js";

export const adminMiddleware = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization?.replace("Bearer ", "");
  if (!token) throw new ApiError(401, "Unauthorized — no token provided");

  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_ADMIN_SECRET);
  } catch {
    throw new ApiError(401, "Unauthorized — invalid or expired token");
  }

  const admin = await Admin.findById(decoded._id).select("-password");
  if (!admin) throw new ApiError(401, "Unauthorized — admin not found");

  req.admin = admin;
  next();
});
