const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  status: { type: String, default: "To Do" },
  position: { type: Number, default: 0 },
});

const Task = mongoose.model("Task", taskSchema);
module.exports = Task;
