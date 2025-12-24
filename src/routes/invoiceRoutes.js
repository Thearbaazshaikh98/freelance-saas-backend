import express from "express";
import {
  createInvoice,
  getInvoices,
  updateInvoice,
  sendInvoice,
  createRazorpayOrder,
} from "../controllers/invoiceController.js";

import { authMiddleware } from "../middlewares/authMiddleware.js";
import roleCheckMiddleware from "../middlewares/roleCheckMiddleware.js";

const router = express.Router();

router.use(authMiddleware);

router.post("/", createInvoice);
router.get("/", getInvoices);
router.put("/:id", updateInvoice);
router.put("/:id/send", roleCheckMiddleware("OWNER", "ADMIN"), sendInvoice);
router.put("/:id/pay", createRazorpayOrder);

export default router;
