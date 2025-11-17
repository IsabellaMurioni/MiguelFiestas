import express, { Request, Response, NextFunction } from "express";
import { userRouter } from "./routers/userRouter";
import eventRouter from "./routers/eventRouter";
import authRouter from "./routers/authRouter";

import path from "path";

import cookieParser from "cookie-parser";
import cors from "cors"

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

// Routers
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
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
