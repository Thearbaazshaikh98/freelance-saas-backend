import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { verifyPayment } from "../controllers/paymentController.js";

const router = express.Router();

router.use(authMiddleware);
router.put("/verify", verifyPayment);

export default router;
