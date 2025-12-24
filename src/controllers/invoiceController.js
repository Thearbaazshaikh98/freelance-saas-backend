import Invoice from "../models/invoice.js";
import Client from "../models/client.js";
import razorpay from "../config/razorpay.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * CREATE INVOICE
 */
export const createInvoice = asyncHandler(async (req, res) => {
  const { clientId, amount, dueDate } = req.body;

  // Ensure client belongs to user
  const client = await Client.findOne({
    _id: clientId,
    userId: req.user.userId,
  });

  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  const invoice = await Invoice.create({
    clientId,
    amount,
    dueDate,
    userId: req.user.userId,
  });

  res.status(201).json(invoice);
});

/**
 * GET ALL INVOICES
 */
export const getInvoices = asyncHandler(async (req, res) => {
  const filter = { userId: req.user.userId };

  if (req.query.clientId) {
    filter.clientId = req.query.clientId;
  }
  const invoices = await Invoice.find(filter)
    .populate("clientId", "name email")
    .sort({ createdAt: -1 });

  res.status(200).json(invoices);
});

/**
 * UPDATE INVOICE
 */
export const updateInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.status(200).json(invoice);
});

/**
 * MARK INVOICE AS SENT
 */
export const sendInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    { status: "SENT" },
    { new: true }
  );

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  res.status(200).json(invoice);
});

/**
 * MARK INVOICE AS PAID (manual for now)
 */
// export const markAsPaid = async (req, res) => {
//   const invoice = await Invoice.findOneAndUpdate(
//     { _id: req.params.id, userId: req.user.userId },
//     { status: "PAID" },
//     { new: true }
//   );

//   if (!invoice) {
//     return res.status(404).json({ message: "Invoice not found" });
//   }

//   res.status(200).json(invoice);
// };


/**
 * CREATE RAZORPAY ORDER
 */

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({
    _id: req.params.id,
    userId: req.user.userId
  });

  if (!invoice) {
    return res.status(404).json({ message: "Invoice not found" });
  }

  if (invoice.status === "PAID") {
    return res.status(400).json({ message: "Invoice already paid" });
  }

  const options = {
    amount: invoice.amount * 100, // paise
    currency: "INR",
    receipt: `invoice_${invoice._id}`
  };

  const order = await razorpay.orders.create(options);

  invoice.razorpayOrderId = order.id;
  await invoice.save();

  res.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    key: process.env.RAZORPAY_KEY_ID
  });
});
