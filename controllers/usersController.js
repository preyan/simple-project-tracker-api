const User = require("../models/user");
const Project = require("../models/project");
const Task = require("../models/task");

const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");

// @desc    Get all users
// @route   GET /users
// @access  Private
getUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password").lean();
  if (!users || users.length === 0) {
    res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc    Create new user
// @route   POST /users
// @access  Private
createUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  //Confirm data - Check if all required fields are provided
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({ message: "Please provide all required fields" });
  }

  //Duplicate Check - Check if user already exists
  const isDuplicate = await User.findOne({ username }).lean().exec();
  if (isDuplicate) {
    res.status(409).json({ message: "User already exists" });
  }

  //Hash password - Hash password before saving to database
  const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
  const userDetails = {
    username,
    password: hashedPassword,
    roles,
  };

  //Create and save the user details
  const user = await User.create(userDetails);
  if (!user) {
    res.status(400).json({ message: "Invalid user details recieved" });
  }
  res
    .status(201)
    .json({ message: `User '${user.username}' created successfully` });
});

// @desc    Update user
// @route   PATCH /users
// @access  Private
updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, active, roles } = req.body;
  //Confirm data - Check if all required fields are provided
  if (
    !id ||
    !username ||
    !password ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    res.status(400).json({ message: "Please provide all required fields" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    res.status(404).json({ message: "User not found" });
  }
  //Check Duplicate - Check if username is already taken
  const isDuplicate = await User.findOne({ username }).lean().exec();
  //Allow updates to the original user
  if (isDuplicate && isDuplicate._id.toString() !== id) {
    res.status(409).json({ message: "Username already taken" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  //Check if password is changed
  if (password) {
    //Hash password - Hash password before saving to database
    const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10
    user.password = hashedPassword;
  }

  const updatedUser = await user.save();

  res.json({ message: `User '${updatedUser.username}' updated successfully` });
});

// @desc    Delete a user
// @route   DELETE /users
// @access  Private
deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: "Please provide a valid UserID" });
  }
  const tasks = await Task.findOne({ user: id }).lean().exec();
  if (tasks?.length) {
    res.status(400).json({ message: "User has active tasks" });
  }

  const user = await User.findById(id).exec();
  if (!user) {
    res.status(404).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  res.json({
    message: `User '${result.username}' with ID '${result.id}' deleted successfully`,
  });
});

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
};
