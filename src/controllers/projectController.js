import Project from "../models/project.js";
import Client from "../models/client.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * CREATE PROJECT
 */
export const createProject = asyncHandler(async (req, res) => {
  const { name, description, clientId } = req.body;

  // Ensure client belongs to user
  const client = await Client.findOne({
    _id: clientId,
    userId: req.user.userId,
  });

  if (!client) {
    return res.status(404).json({ message: "Client not found" });
  }

  const project = await Project.create({
    name,
    description,
    clientId,
    userId: req.user.userId,
  });

  res.status(201).json(project);
});

/**
 * GET PROJECTS
 */
export const getProjects = asyncHandler (async (req, res) => {
  const filter = { userId: req.user.userId };

  if (req.query.clientId) {
    filter.clientId = req.query.clientId;
  }

  const projects = await Project.find(filter)
    .populate("clientId", "name")
    .sort({ createdAt: -1 });

  res.status(200).json(projects);
});

/**
 * UPDATE PROJECT
 */
export const updateProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.status(200).json(project);
});

/**
 * DELETE PROJECT
 */
export const deleteProject = asyncHandler(async (req, res) => {
  const project = await Project.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  res.status(200).json({ message: "Project deleted successfully" });
});
