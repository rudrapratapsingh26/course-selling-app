import { Course } from "../models/course.models.js";
import { Purchase } from "../models/purchase.models.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const getAllCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses retrieved successfully"));
});

export const purchaseCourse = asyncHandler(async (req, res) => {
  const { courseId } = req.body;
  if (!courseId) throw new ApiError(400, "courseId is required");

  const course = await Course.findById(courseId);
  if (!course) throw new ApiError(404, "Course not found");

  const alreadyPurchased = await Purchase.findOne({
    userId: req.user._id,
    courseId,
  });
  if (alreadyPurchased) throw new ApiError(409, "Course already purchased");

  const purchase = await Purchase.create({
    userId: req.user._id,
    courseId,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, purchase, "Course purchased successfully"));
});
