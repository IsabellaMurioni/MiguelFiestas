import { Router, Request, Response } from "express";
import { UserService } from "../services/userService";

const userRouter = Router();
const userService = new UserService();

import { requireAuth } from "../middleware/requireAuth";

/**
 * Authenticated request interface
 */
interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

/**
 * Middleware to verify JWT token and attach user to request
 */

/**
 * GET /users/me
 * Returns the authenticated user's profile
 */
userRouter.get("/me", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const token = req.user!
    const profile = await userService.getProfile(token.id);

    res.status(200).json(profile);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * PATCH /users/:id
 * Updates user profile data
 */
userRouter.patch("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid ID" });

    if (req.user!.id !== userId) return res.status(403).json({ error: "Unauthorized" });

    const updated = await userService.updateProfile(userId, req.body);
    res.status(200).json(updated);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /users/:id/balance
 * Adds balance to user's account
 * Body: { amount: number }
 */
userRouter.post("/:id/balance", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid ID" });

    if (req.user!.id !== userId) return res.status(403).json({ error: "Unauthorized" });

    const { amount } = req.body;
    const result = await userService.addBalance(userId, amount);
    res.status(200).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /users/:id/transactions
 * Returns the transaction history of a user
 */
userRouter.get("/:id/transactions", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = Number(req.params.id);
    if (isNaN(userId)) return res.status(400).json({ error: "Invalid ID" });

    if (req.user!.id !== userId) return res.status(403).json({ error: "Unauthorized" });

    const transactions = await userService.getTransactions(userId);
    res.status(200).json(transactions);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /users/me/joined-events
 * Returns events the user has joined/attended
 */
userRouter.get("/me/joined-events", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const events = await userService.getJoinedEvents(userId);
    res.status(200).json(events);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * GET /users/me/owned-events  
 * Returns events created by the user
 */
userRouter.get("/me/created-events", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const events = await userService.getCreatedEvents(userId);
    res.status(200).json(events);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /users/register
 * Registers a new user
 * Body: CreateUserBody
 */
userRouter.post("/register", async (req: Request, res: Response) => {
  try {
    const user = await userService.createUser(req.body);
    res.status(201).json({ data: user });
  } catch (err: any) {
    console.error(err);
    res.status(400).json({ error: err.message });
  }
});




export { userRouter };
