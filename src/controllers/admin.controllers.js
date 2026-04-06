import { Admin } from "../models/admin.models.js";
import { Course } from "../models/course.models.js";
import { ApiError } from "../utils/api-errors.js";
import { ApiResponse } from "../utils/api-response.js";
import { asyncHandler } from "../utils/async-handler.js";

export const registerAdmin = asyncHandler(async (req, res) => {
  const { email, password, firstName, lastName } = req.body;
  if (!email || !password || !firstName) {
    throw new ApiError(400, "Email, password and firstName are required");
  }
  const existing = await Admin.findOne({ email });
  if (existing) throw new ApiError(409, "Email already registered");

  const admin = await Admin.create({ email, password, firstName, lastName });
  return res.status(201).json(
    new ApiResponse(
      201,
      {
        id: admin._id,
        email: admin.email,
      },
      "Admin registered successfully"
    )
  );
});

export const loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    throw new ApiError(400, "Email and password are required");

  const admin = await Admin.findOne({ email });
  if (!admin) throw new ApiError(401, "Invalid credentials");

  const isValid = await admin.comparePassword(password);
  if (!isValid) throw new ApiError(401, "Invalid credentials");

  const token = admin.generateToken();
  return res
    .status(200)
    .json(new ApiResponse(200, { token }, "Login successful"));
});

export const createCourse = asyncHandler(async (req, res) => {
  const { title, description, price, imageUrl } = req.body;
  if (!title || !description || !price) {
    throw new ApiError(400, "Title, description and price are required");
  }
  const course = await Course.create({
    title,
    description,
    price,
    imageUrl,
    creatorId: req.admin._id,
  });
  return res
    .status(201)
    .json(new ApiResponse(201, course, "Course created successfully"));
});

export const updateCourse = asyncHandler(async (req, res) => {
  if (Object.keys(req.body).length === 0) {
    throw new ApiError(400, "At least one field is required");
  }
  const course = await Course.findOneAndUpdate(
    { _id: req.params.id, creatorId: req.admin._id },
    req.body,
    { new: true }
  );
  if (!course) throw new ApiError(404, "Course not found");
  return res
    .status(200)
    .json(new ApiResponse(200, course, "Course updated successfully"));
});

export const getAdminCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find({ creatorId: req.admin._id });
  return res
    .status(200)
    .json(new ApiResponse(200, courses, "Courses retrieved successfully"));
});

export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findOneAndDelete({
    _id: req.params.id,
    creatorId: req.admin._id,
  });
  if (!course) throw new ApiError(404, "Course not found");
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Course deleted successfully"));
});
