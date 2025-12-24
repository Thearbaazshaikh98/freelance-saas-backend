import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { getDashboardStats } from "../controllers/dashboardController.js";
import roleCheckMiddleware from "../middlewares/roleCheckMiddleware.js";

const router = express.Router();

router.put(
  "/stats",
  authMiddleware,
  roleCheckMiddleware("OWNER", "ADMIN"),
  getDashboardStats
);

export default router;
