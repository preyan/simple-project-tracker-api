const express = require("express");
const router = express.Router();
const tasksController = require("../controllers/tasksController");

router
  .route("/")
  .get(tasksController.getTasks)
  .post(tasksController.createTask)
  .patch(tasksController.updateTask)
  .delete(tasksController.deleteTask);

module.exports = router;
