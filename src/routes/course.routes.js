import { Router } from "express";
import { userMiddleware } from "../middleware/user.middleware.js";
import {
  getAllCourses,
  purchaseCourse,
} from "../controllers/course.controllers.js";

const router = Router();

router.get("/preview", getAllCourses);
router.post("/purchase", userMiddleware, purchaseCourse);

export default router;
