import express from "express"
import { protectRoute } from "../middleware/protectRoute.js";
import {getAllTasks,createTask, updateTask, deleteTask} from "../controller/task.controller.js"

const router = express.Router();

router.get("/",protectRoute,getAllTasks)
router.post("/",protectRoute,createTask)
router.patch("/update/:id",protectRoute,updateTask)
router.delete("/delete/:id",protectRoute,deleteTask)

export default router;