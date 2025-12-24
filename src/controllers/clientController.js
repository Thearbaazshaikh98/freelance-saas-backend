import Client from "../models/client.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * CREATE CLIENT
 */
export const createClient = asyncHandler(async (req, res) => {
  const { name, email, phone } = req.body;

  const client = await Client.create({
    name,
    email,
    phone,
    userId: req.user.userId,
  });

  res.status(201).json(client);
});

/**
 * GET ALL CLIENTS (only logged-in user)
 */
export const getClients = asyncHandler(async (req, res) => {
  const clients = await Client.find({
    userId: req.user.userId,
  }).sort({ createdAt: -1 });

  res.status(200).json(clients);
});

/**
 * UPDATE CLIENT
 */
export const updateClient = asyncHandler(async (req, res) => {
  const client = await Client.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );

  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  res.status(200).json(client);
});

/**
 * DELETE CLIENT
 */
export const deleteClient = asyncHandler(async (req, res) => {
  const client = await Client.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  res.status(200).json({ message: "Client deleted successfully" });
});
