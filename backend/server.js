import express from "express"
import authRouter from "./routes/auth.routes.js"
import dotenv from "dotenv" 
import connectDb from "./db/connectMongodb.js"
import cookieParser from "cookie-parser";
import taskRouter from "./routes/task.routes.js"
import userRouter from "./routes/user.routes.js"
import trackerRouter from "./routes/tracker.routes.js"

dotenv.config()
const app = express()

const port = 5000

//middleware
app.use(express.json()) //parse req.body
app.use(express.urlencoded({extended:true})) //parse form data
app.use(cookieParser()); 



//routes
app.use("/api/auth",authRouter)
app.use("/api/tasks",taskRouter)
app.use("/api/user",userRouter)
app.use("/api/tracker",trackerRouter)




app.listen(port,() =>{
    console.log("App listening on port: ",port)
    connectDb()
})