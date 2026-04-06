import { Router } from "express";
import {
  registerUser,
  loginUser,
  getPurchases,
} from "../controllers/user.controllers.js";
import { userMiddleware } from "../middleware/user.middlewares.js";
const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

export default router;
