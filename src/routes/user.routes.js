import { Router } from "express";
import { userMiddleware } from "../middlewares/user.middlewares.js";
import {
  registerUser,
  loginUser,
  getPurchases,
} from "../controllers/user.controllers.js";

const router = Router();

router.post("/signup", registerUser);
router.post("/signin", loginUser);
router.get("/purchases", userMiddleware, getPurchases);

export default router;
