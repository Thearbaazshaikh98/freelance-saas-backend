import Task from "../models/task.js";
import Project from "../models/project.js";
import asyncHandler from "../utils/asyncHandler.js";

/**
 * CREATE TASK
 */
export const createTask = asyncHandler(async (req, res) => {
  const { title, description, dueDate, projectId } = req.body;

  // Ensure project belongs to user
  const project = await Project.findOne({
    _id: projectId,
    userId: req.user.userId,
  });

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  const task = await Task.create({
    title,
    description,
    dueDate,
    projectId,
    userId: req.user.userId,
  });

  res.status(201).json(task);
});

/**
 * GET TASKS BY PROJECT
 */
export const getTasks = asyncHandler(async (req, res) => {
  const { projectId } = req.query;

  const tasks = await Task.find({
    projectId,
    userId: req.user.userId,
  }).sort({ createdAt: -1 });

  res.status(200).json(tasks);
});

/**
 * UPDATE TASK (status / title / dueDate)
 */
export const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.userId },
    req.body,
    { new: true }
  );

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json(task);
});

/**
 * DELETE TASK
 */
export const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndDelete({
    _id: req.params.id,
    userId: req.user.userId,
  });

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  res.status(200).json({ message: "Task deleted" });
});
