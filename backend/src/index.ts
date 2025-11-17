import express, { Request, Response, NextFunction } from "express";
import { userRouter } from "./routers/userRouter";
import eventRouter from "./routers/eventRouter";
import authRouter from "./routers/authRouter";

import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3001', // Vite URL
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Routers
app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/auth", authRouter);

// Global middleware to handle errors
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
});

// Start server
const PORT = Number(process.env.PORT);
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
