const Task = require("../models/Task");

// @desc    Get all tasks
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Create new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    console.log("exports.createTask= ~ req.body:", {
      title,
      description,
      status,
    });

    // Find the current max position in the given status column
    const maxPositionTask = await Task.findOne({ status })
      .sort("-position")
      .select("position");

    const newPosition = maxPositionTask ? maxPositionTask.position + 1 : 0;

    const newTask = new Task({
      title,
      description,
      status,
      position: newPosition,
    });
    await newTask.save();
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc    Update a task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    // console.log("exports.updateTask= ~ task:", task);

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

// @desc Update task order in a column
exports.updateTaskOrder = async (req, res) => {
  // console.log("exports.updateTaskOrder= ~ req:", req);

  try {
    const { columnId, tasks } = req.body;
    // console.log("Received payload:", { columnId, tasks });

    if (!columnId || !Array.isArray(tasks)) {
      return res
        .status(400)
        .json({ message: "Invalid columnId or tasks format" });
    }

    // Validate each task in the tasks array
    for (const task of tasks) {
      if (!task.id || task.position === undefined) {
        return res
          .status(400)
          .json({ message: "Each task must have an id and position" });
      }
    }

    // Update each task's position in the database
    const updatePromises = tasks.map(async (task) => {
      try {
        const updatedTask = await Task.findByIdAndUpdate(
          task.id,
          {
            position: task.position,
            status: columnId,
          },
          { new: true }
        );

        if (!updatedTask) {
          console.error(`Task with ID ${task.id} not found`);
          throw new Error(`Task with ID ${task.id} not found`);
        }

        return updatedTask;
      } catch (err) {
        console.error(`Error updating task with ID ${task.id}:`, err);
        throw err;
      }
    });
    // console.log("updatePromises ~ updatePromises:", updatePromises);

    // Wait for all promises to resolve
    await Promise.all(updatePromises);

    res.status(200).json({ message: "Task order updated successfully" });
  } catch (error) {
    console.error("Error updating task order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// @desc    Delete a task
exports.deleteTask = async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Task Deleted" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};
