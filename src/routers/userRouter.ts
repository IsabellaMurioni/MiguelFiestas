import { Router } from "express";
import { UserService } from "../services/userServices"
;
import { JwtService } from "../services/jwtService";

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

export default userRouter;

