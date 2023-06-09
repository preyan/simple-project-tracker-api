const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");

router
  .route("/")
  .get(usersController.getUsers)
  .post(usersController.createUser)
  .patch(usersController.updateUser)
  .delete(usersController.deleteUser);

module.exports = router;
