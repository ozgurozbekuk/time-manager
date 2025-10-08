import express from "express";
import authRouter from "./routes/auth.routes.js";
import dotenv from "dotenv";
import connectDb from "./db/connectMongodb.js";
import cookieParser from "cookie-parser";
import taskRouter from "./routes/task.routes.js";
import userRouter from "./routes/user.routes.js";
import trackerRouter from "./routes/tracker.routes.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_BUILD_PATH = path.resolve(__dirname, "../frontend/dist");
const isProduction = process.env.NODE_ENV === "production";
const port = process.env.PORT || 5000;

// middleware
app.use(express.json()); // parse req.body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cookieParser());

app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || '*',
  credentials: true
}));


// routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/user", userRouter);
app.use("/api/tracker", trackerRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

if (isProduction) {
  app.use(express.static(CLIENT_BUILD_PATH));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
  });
}

const startServer = async () => {
  try {
    await connectDb();
    app.listen(port, () => {
      console.log("App listening on port: ", port);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
