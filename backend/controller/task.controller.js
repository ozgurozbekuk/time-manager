import mongoose from "mongoose";
import Task from "../models/tasks.models.js";

export const getAllTasks = async (req, res) => {
  try {
    if (!req.user?.id && !req.user?._id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const userId = req.user._id;

    const tasks = await Task.find( { user: userId } ).sort({ createdAt: -1 });

    res.status(200).json(tasks);
  } catch (error) {
    console.log("getAllTasks func error: ", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title, description, priority, status, dueDate } = req.body;
    const userId = req.user._id 

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newTask = new Task({
      title: title,
      description: description,
      priority: priority,
      status: status,
      dueDate: dueDate,
      user:userId,
    });

    if (!title || !title.trim()) {
      return res.status(400).json({ error: "title is required" });
    }

    await newTask.save();
    res.status(200).json(newTask);
  } catch (error) {
    console.log("Create task controller error : ", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateTask = async (req, res) => {
  try {
    const userId = req.user._id
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    const { id: taskId } = req.params;
    if (!mongoose.isValidObjectId(taskId)) {
      return res.status(400).json({ error: "Invalid task id" });
    }

    const { title, description, priority, status, dueDate } = req.body;

    const updatedTask = await Task.findOneAndUpdate(
      { _id: taskId, user: userId },  
      { $set: { title, description, priority, status, dueDate } },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task does not exist" });
    }

    return res.status(200).json(updatedTask);

  } catch (error) {
    if (error.name === "CastError") {
      return res.status(400).json({ error: "Invalid task id" });
    }
    console.error("Update task controller error:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
};

export const deleteTask =async (req,res) =>{
  try {
    const taskId = req.params.id;
    const deletedTask = await Task.findByIdAndDelete(taskId)

    if(!deleteTask){
      res.status(404).json({error:"Task not found"})
    }

    res.status(200).json({message:"Task deleted successfully"})
  } catch (error) {
     res.status(500).json({ error: "Internal server error" });
    console.log("Delete  task controller error: ", error);
  }
}
