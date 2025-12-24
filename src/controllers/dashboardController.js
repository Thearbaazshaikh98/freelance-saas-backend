import Client from "../models/client.js";
import Project from "../models/project.js";
import Invoice from "../models/invoice.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user.userId;

  const totalClients = await Client.countDocuments({ userId });

  const totalProjects = await Project.countDocuments({ userId });

  const activeProjects = await Project.countDocuments({
    userId,
    status: "ACTIVE",
  });

  const pendingInvoices = await Invoice.countDocuments({
    userId,
    status: "PENDING",
  });

  const totalRevenueData = await Invoice.aggregate([
    { $match: { userId, status: "PAID" } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const totalRevenue = totalRevenueData[0]?.total || 0;

  // Monthly revenue
  const startOfMonth = new Date();
  startOfMonth.setDate(1);
  startOfMonth.setHours(0, 0, 0, 0);

  const monthlyRevenueData = await Invoice.aggregate([
    {
      $match: {
        userId,
        status: "PAID",
        createdAt: { $gte: startOfMonth },
      },
    },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);

  const monthlyRevenue = monthlyRevenueData[0]?.total || 0;

  res.json({
    totalClients,
    totalProjects,
    activeProjects,
    pendingInvoices,
    totalRevenue,
    monthlyRevenue,
  });
});
