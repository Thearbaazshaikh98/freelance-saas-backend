import crypto from "crypto";
import asyncHandler from "../utils/asyncHandler.js";
/**
 * VERIFY PAYMENT
 */
export const verifyPayment = asyncHandler(async (req, res) => {
  const { orderId, paymentId, signature } = req.body;

  const body = orderId + "|" + paymentId;

  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expectedSignature !== signature) {
    return res.status(400).json({ message: "Payment verification failed" });
  }

  const invoice = await Invoice.findOne({ razorpayOrderId: orderId });
  invoice.status = "PAID";
  invoice.razorpayPaymentId = paymentId;
  await invoice.save();

  res.json({ message: "Payment successful" });
});