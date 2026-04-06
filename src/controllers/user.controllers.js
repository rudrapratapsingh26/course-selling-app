import {userModel} from "../models/user.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiResponse} from "../utils/apiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const {username, email, password} = req.body;
    const existingUser = await userModel.findOne({email});
    if (existingUser) {
        return res.status(400).json(new ApiResponse(400, null, "Email already in use"));
    }
    