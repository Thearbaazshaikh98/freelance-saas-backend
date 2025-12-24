import express from "express";
import {
  createTask,
  getTasks,
  updateTask,
  deleteTask,
} from "../controllers/taskController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import roleCheckMiddleware from "../middlewares/roleCheckMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createTask);
router.get("/", getTasks);
router.put("/:id", updateTask);
router.delete("/:id", roleCheckMiddleware("OWNER", "ADMIN"), deleteTask);

export default router;
