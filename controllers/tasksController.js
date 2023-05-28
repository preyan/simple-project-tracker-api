const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");

const asyncHandler = require("express-async-handler");
const task = require("../models/task");

// @desc    Get all tasks
// @route   GET /tasks
// @access  Private
getTasks = asyncHandler(async (req, res) => {
  const tasks = await User.find().lean();
  if (!tasks || tasks.length === 0) {
    return res.status(400).json({ message: "No Tasks found" });
  }
  res.json(tasks);
});

// @desc    Create new task
// @route   POST /tasks
// @access  Private
createTask = asyncHandler(async (req, res) => {
  const { user, project, title, description } = req.body;

  //Confirm data - Check if all required fields are provided
  if (!user || !project || !title || !description) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const taskDetails = {
    user,
    project,
    title,
    description,
  };

  //Create and save the Task details
  const task = await Task.create(taskDetails);
  if (!task) {
    return res.status(400).json({ message: "Invalid Task details recieved" });
  }
  res.status(201).json({ message: `Task created successfully` });
});

// @desc    Update task
// @route   PATCH /tasks
// @access  Private
updateTask = asyncHandler(async (req, res) => {
  const { id, user, project, title, description, completed } = req.body;

  //Confirm data - Check if all required fields are provided
  if (
    !id ||
    !user ||
    !project ||
    !title ||
    !description ||
    typeof completed !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const task = await Task.findById(id).exec();

  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }

  if (user) task.user = user;
  if (project) task.project = project;
  if (title) task.title = title;
  if (description) task.description = description;
  if (completed) task.completed = completed;

  const updatedtask = await task.save();

  res.json({ message: `Task '${updatedtask.title}' updated successfully` });
});

// @desc    Delete a task
// @route   DELETE /tasks
// @access  Private
deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ message: "Please provide a valid TaskID" });
  }
  //Check if task has active project
  if (task?.project) {
    const project = await Project.findById(task.project).lean().exec();
    if (project && project?.active === true && task?.completed === false)
      return res
        .status(400)
        .json({ message: "Task is in an Active project and is NOT completed" });
  }
  //Check if task has active user
  if (task?.user) {
    const user = await User.findById(task.user).lean().exec();
    if (user && user?.active === true && task?.completed === false)
      return res.status(400).json({
        message: "Task is assigned to an Active user and is NOT completed",
      });
  }

  const task = await Task.findById(id).exec();
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  if (!task.completed) {
    return res.status(400).json({ message: "Task is NOT completed" });
  }

  const result = await task.deleteOne();

  res.json({
    message: `Task '${result.title}' with ID '${result.id}' deleted successfully`,
  });
});

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask,
};
