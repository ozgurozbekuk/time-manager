import express from "express";
import { protectRoute } from "../middleware/protectRoute.js";
import {updateMyName,updatePassword,deleteMe} from "../controller/user.controller.js"


const router = express.Router();

router.patch("/update",protectRoute, updateMyName);
router.patch("/password", protectRoute,updatePassword);
router.delete("/delete",protectRoute,deleteMe)

export default router;