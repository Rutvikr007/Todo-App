const express = require("express");
const {
  getTasks,
  createTask,
  DeleteTask,
  updateTask,
} = require("../controller/taskControllers");
const router = express.Router();

router.route("/").get(getTasks).post(createTask);
router.route("/:id").delete(DeleteTask).patch(updateTask);

module.exports = router;
