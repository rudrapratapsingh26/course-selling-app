import { Router } from "express";
import { adminMiddleware } from "../middlewares/admin.middlewares.js";
import {
  registerAdmin,
  loginAdmin,
  createCourse,
  updateCourse,
  deleteCourse,
  getAdminCourses,
} from "../controllers/admin.controllers.js";

const router = Router();

router.post("/signup", registerAdmin);
router.post("/signin", loginAdmin);
router
  .route("/course")
  .post(adminMiddleware, createCourse)
  .get(adminMiddleware, getAdminCourses);
router
  .route("/course/:id")
  .put(adminMiddleware, updateCourse)
  .delete(adminMiddleware, deleteCourse);

export default router;
