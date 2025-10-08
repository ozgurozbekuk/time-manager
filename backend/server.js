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
import cors from "cors";
import fs from "fs";

dotenv.config();
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const CLIENT_BUILD_PATH = path.resolve(__dirname, "../frontend/dist");
const clientIndexPath = path.join(CLIENT_BUILD_PATH, "index.html");
const shouldServeClient = fs.existsSync(clientIndexPath);
const port = process.env.PORT || 5000;

const normalizeOrigin = (value = "") => value.trim().replace(/\/$/, "");

const defaultAllowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://minutly.netlify.app",
];

const allowedOrigins = [
  ...new Set([
    ...defaultAllowedOrigins,
    ...((process.env.CORS_ORIGIN || "")
      .split(",")
      .map(normalizeOrigin)
      .filter(Boolean)),
  ]),
];

const corsOptions = {
  origin(origin, cb) {
    if (!origin) return cb(null, true);
    const normalizedOrigin = normalizeOrigin(origin);

    if (allowedOrigins.length === 0 || allowedOrigins.includes(normalizedOrigin)) {
      return cb(null, true);
    }
    return cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));
// Mirror main CORS options for preflight requests so credentials/origin headers match.
app.options(/^\/.*/, cors(corsOptions)); 

// middleware
app.use(express.json()); // parse req.body
app.use(express.urlencoded({ extended: true })); // parse form data
app.use(cookieParser());



// routes
app.use("/api/auth", authRouter);
app.use("/api/tasks", taskRouter);
app.use("/api/user", userRouter);
app.use("/api/tracker", trackerRouter);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

if (shouldServeClient) {
  app.use(express.static(CLIENT_BUILD_PATH));

  app.get(/^\/(?!api).*/, (_req, res) => {
    res.sendFile(clientIndexPath);
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
