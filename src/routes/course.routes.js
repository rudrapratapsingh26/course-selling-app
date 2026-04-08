import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middlewares.js";
import {
  getAllCourses,
  purchaseCourse,
} from "../controllers/course.controllers.js";

const router = Router();

router.get("/preview", getAllCourses);
router.post("/purchase", userMiddleware, purchaseCourse);

export default router;
