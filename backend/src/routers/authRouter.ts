import { Router, Request, Response } from "express";
import { authService } from "../services/authService";

const authRouter = Router();

/**
 * POST /auth/login
 */
authRouter.post("/login", async (req: Request, res: Response) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email y contraseña requeridos" });
    }

    const result = await authService.login(email, password);

    res.cookie("token", result.accessToken, {
      httpOnly: true,
      sameSite: "strict"
    });

    res.status(200).json({ message: "Login exitoso" });

  } catch (err: any) {
    res.status(401).json({ error: err.message || "Credenciales inválidas" });
  }
});

/**
 * POST /auth/logout
 * Borra la cookie de sesión
 */
authRouter.post("/logout", (req: Request, res: Response) => {
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production"
  });

  res.status(200).json({ message: "Logout exitoso. Sesión finalizada." });
});

export default authRouter;