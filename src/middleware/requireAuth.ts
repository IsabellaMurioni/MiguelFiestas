import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/jwtService";

const jwtService = new JwtService();

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ error: "No autenticado" });

    const decoded = await jwtService.verifyAccessToken(token);
    (req as any).user = decoded;

    next();
  } catch (err: any) {
    res.status(401).json({ error: err.message || "Token inválido o expirado" });
  }
};
