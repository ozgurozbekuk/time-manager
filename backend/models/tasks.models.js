import mongoose from "mongoose";

const taskSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default:"",
    },
    priority: {
      type: Number,
      enum: [1, 2, 3], // 1 = low, 2 = medium, 3 = high
      default: 2,
      index: true,
    },
    status: {
      type: String,
      enum: ["todo", "doing", "done"],
      default: "todo",
      index: true,
    },
    dueDate: {
      type: Date,
      index: true,
      default:"",
    },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);

export default Task;
