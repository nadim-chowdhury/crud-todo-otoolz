const express = require("express");
const router = express.Router();
const {
  getTasks,
  createTask,
  updateTask,
  updateTaskOrder,
  deleteTask,
} = require("../controllers/taskController");

router.get("/", getTasks);
router.post("/", createTask);
router.put("/:id", updateTask);
router.post("/order", updateTaskOrder);
router.delete("/:id", deleteTask);

module.exports = router;
