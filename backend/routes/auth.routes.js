import express from "express"
import {login,logout,register,getMe} from "../controller/auth.controller.js"
import { protectRoute } from "../middleware/protectRoute.js"

const router = express.Router()

router.get("/me",protectRoute,getMe)
router.post("/login",login)
router.post("/register",register)
router.post("/logout",logout)



export default router;