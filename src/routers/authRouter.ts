import { Router } from "express";
import { AuthService } from "../services/authService"; 

const authRouter = Router();
const authService = new AuthService();

/**
 * POST /auth/register
 * body: { name, email, password }
 */
authRouter.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "Faltan datos" });

    const result = await authService.register(name, email, password);
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Error al registrar" });
  }
});

/**
 * POST /auth/login
 * body: { email, password }
 */
authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "Faltan datos" });

    const result = await authService.login(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message || "Error al iniciar sesión" });
  }
});

export default authRouter;
