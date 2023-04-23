const Tasks = require("../models/task");
const mongoose = require("mongoose");
const User = require("../models/user");

const getTasks = async (req, res) => {
  const allTask = await Tasks.find({ user: req.user.id });
  res.status(200).json(allTask);
};

const createTask = async (req, res) => {
  const { title, task } = req.body;
  const user = req.user.id;

  if (!title || !task) {
    return res.status(400).json({ msg: "please fill all fields" });
  }

  const Task = await Tasks.create({ title, task, user, completed: false });

  res.status(200).json({ Task });
};

const DeleteTask = async (req, res) => {
  const id = req.params.id;
  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ msg: "please send valid id" });
  }

  const checkTask = await Tasks.findById(id);
  if (!checkTask) {
    res.status(400).json({ msg: "Goal not found" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ msg: "User not Found" });
  }

  if (checkTask.user.toString() !== user.id) {
    return res.status(401).json({ msg: "Invalid user" });
  }

  const task = await Tasks.findByIdAndDelete(id);

  res.status(200).json({ task });
};

const updateTask = async (req, res) => {
  const id = req.params.id;
  const { title, task, completed } = req.body;

  if (!id || !mongoose.isValidObjectId(id)) {
    return res.status(400).json({ msg: "please send valid id" });
  }

  const checkTask = await Tasks.findById(id);
  if (!checkTask) {
    res.status(400).json({ msg: "Goal not found" });
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ msg: "User not Found" });
  }

  if (checkTask.user.toString() !== user.id) {
    return res.status(401).json({ msg: "Invalid user" });
  }

  const Task = await Tasks.findByIdAndUpdate(
    { _id: id },
    { task, title, completed }
  );

  res.status(200).json({ Task });
};

module.exports = {
  getTasks,
  createTask,
  DeleteTask,
  updateTask,
};
