const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");

const asyncHandler = require("express-async-handler");

// @desc    Get all projects
// @route   GET /projects
// @access  Private
getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find().lean();
  if (!projects || projects.length === 0) {
    return res.status(400).json({ message: "No projects found" });
  }
  res.json(projects);
});

// @desc    Create new project
// @route   POST /projects
// @access  Private
createProject = asyncHandler(async (req, res) => {
  const { name, createdBy } = req.body;

  //Confirm data - Check if all required fields are provided
  if (!name || !createdBy) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  //Duplicate Check - Check if name already exists
  const isDuplicate = await Project.findOne({ name }).lean().exec();
  if (isDuplicate) {
    return res
      .status(409)
      .json({ message: `Project '${name}' already exists` });
  }

  //Create and save the project details
  const project = await Project.create({ name, createdBy });
  if (!project) {
    return res
      .status(400)
      .json({ message: "Invalid project details recieved" });
  }
  res
    .status(201)
    .json({ message: `Project '${project.name}' created successfully` });
});

// @desc    Update project
// @route   PATCH /projects
// @access  Private
updateProject = asyncHandler(async (req, res) => {
  const { id, name, createdBy, active, users, tasks } = req.body;
  //Confirm data - Check if all required fields are provided
  if (
    !id ||
    !name ||
    !createdBy ||
    !Array.isArray(users) ||
    !users.length ||
    !Array.isArray(tasks) ||
    !tasks.length ||
    typeof active !== "boolean"
  ) {
    return res
      .status(400)
      .json({ message: "Please provide all required fields" });
  }

  const project = await Project.findById(id).exec();

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }
  //Check Duplicate - Check if name is already taken
  const isDuplicate = await Project.findOne({ username }).lean().exec();
  //Allow updates to the original project
  if (isDuplicate && isDuplicate._id.toString() !== id) {
    return res.status(409).json({ message: "Project name already taken" });
  }

  project.name = name;
  project.createdBy = createdBy;
  project.active = active;

  if (users) project.users = users; //Only update users if provided
  if (tasks) project.tasks = tasks; //Only update tasks if provided

  const updatedProject = await project.save();

  res.json({
    message: `Project '${updatedProject.name}' updated successfully`,
  });
});

// @desc    Delete a project
// @route   DELETE /projects
// @access  Private
deleteProject = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: "Please provide a valid ProjectID" });
  }

  const project = await Project.findById(id).exec();
  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  //Check if project has active users
  if (project?.users?.length) {
    const users = await (await User.find({ _id: { $in: project.users } }))
      .lean()
      .exec();
    if (users?.length)
      return res.status(400).json({ message: "Project has active user" });
  }

  //Check if project has active tasks
  if (project?.tasks?.length) {
    const tasks = await (await Task.find({ _id: { $in: project.tasks } }))
      .lean()
      .exec();
    if (tasks?.length)
      return res.status(400).json({ message: "Project has active task" });
  }

  const result = await project.deleteOne();

  res.json({
    message: `Project '${result.name}' created by '${result.createdBy}' with ID '${result.id}' deleted successfully`,
  });
});

module.exports = {
  getProjects,
  createProject,
  updateProject,
  deleteProject,
};
