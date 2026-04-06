import { User } from "../models/user.models.js"
import { Purchase } from "../models/purchase.models.js"
import { Course } from "../models/course.models.js"
import { ApiError } from "../utils/api-errors.js"
import { ApiResponse } from "../utils/api-response.js"
import { asyncHandler } from "../utils/async-handler.js"

const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    if(!username || !email || !password) {
        throw new ApiError(400, "All fields are required");
    }
    const existingUser = await userModel.findOne({email});
    if (existingUser) {
        throw new ApiError(409, "Email already in use");
    }
    const user = await User.create({username, email, password});
    return res.status(201).json(new ApiResponse(201, "User registered successfully", {token: user.generateToken()}));
});

export const loginUser = asyncHandler(async (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }
    const user = await User.findOne({email})
    if(!user) {
        throw new ApiError(401, "Invalid email or password");
    }
    const isMatch = await user.comparePassword(password);
    if(!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }
    const token = user.generateToken();
    return res.status(200).json(new ApiResponse(200, "Login successful", {token}));
});

export const getPurchases = asyncHandler(async (req, res) => {
    const purchases = await Purchase.find({user: req.user._id})
    const courseIds = purchases.map(p => p.course);
    const courses = await Course.find({_id: {$in: courseIds}});
    return res.status(200).json(new ApiResponse(200, "Purchases retrieved successfully", {purchases: courses}));
});