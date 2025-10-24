import { Router } from "express";
import { UserService } from "../services/userService";
import { JwtService } from "../services/jwtService";

import { Request, Response } from "express";
import { authService, AuthService } from "../services/authService";

const userRouter = Router();
const userService = new UserService();
const jwtService = new JwtService();

/**
 * Middleware simple para verificar token y obtener usuario
 */
const requireAuth = async (req: any, res: any, next: any) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Token no proporcionado" });

    const token = authHeader.split(" ")[1];
    const decoded = await jwtService.verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch (err: any) {
    res.status(401).json({ error: err.message || "Token inválido" });
  }
};

/**
 * GET /users/me
 * Obtiene el perfil del usuario autenticado
 */
userRouter.get("/me", requireAuth, async (req: any, res) => {
  try {
    const authHeader = req.headers.authorization!;
    const token = authHeader.split(" ")[1];
    const profile = await userService.getProfile(token);
    res.json(profile);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PATCH /users/:id
 * Actualiza los datos del usuario
 */
userRouter.patch("/:id", requireAuth, async (req: any, res) => {
  try {
    const userId = Number(req.params.id);
    if (req.user.id !== userId) return res.status(403).json({ error: "No autorizado" });

    const updated = await userService.updateProfile(userId, req.body);
    res.json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /users/:id/balance
 * body: { amount }
 */
userRouter.post("/:id/balance", requireAuth, async (req: any, res) => {
  try {
    const userId = Number(req.params.id);
    const { amount } = req.body;
    if (req.user.id !== userId) return res.status(403).json({ error: "No autorizado" });

    const result = await userService.addBalance(userId, amount);
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /users/:id/transactions
 */
userRouter.get("/:id/transactions", requireAuth, async (req: any, res) => {
  try {
    const userId = Number(req.params.id);
    if (req.user.id !== userId) return res.status(403).json({ error: "No autorizado" });

    const transactions = await userService.getTransactions(userId);
    res.json(transactions);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

userRouter.post("/register", async (req: Request, res: Response) => {

  try {

    const user = await userService.createUser(req.body)

    res.status(201).json({
      data: user
    })

  } catch (error: any) {
    
    console.log(error)

    res.status(418).json({
      data: error.message
    })

  }

})