import express from "express";

import userRouter from "./routers/userRouter";
import authRouter from "./routers/authRouter";
import eventRouter from "./routers/eventRouter";

const app = express();
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/events", eventRouter);

// Levantar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});