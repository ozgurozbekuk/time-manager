import express from "express";
import {getTrackerTasks,startTracker,stopTracker,manuelTracker,updateTracker,deleteTracker} from "../controller/tracker.controller.js"
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();


router.get("/",protectRoute,getTrackerTasks)
router.post("/start",protectRoute, startTracker)
router.patch("/stop/:id",protectRoute,stopTracker)
router.post("/manuel",protectRoute,manuelTracker)
router.patch("/update/:id",protectRoute,updateTracker)
router.delete("/delete/:id",protectRoute,deleteTracker)



export default router;
