import { Router, Request, Response } from "express";
import { UserService } from "../services/userService";
import { requireAuth } from "../middleware/requireAuth";

const balanceRouter = Router();
const userService = new UserService();

interface AuthRequest extends Request {
  user?: { id: number; email: string };
}

/**
 * GET /balance
 * Returns user's balance and recent transactions
 */
balanceRouter.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const user = await userService.getProfile(userId);
    const transactions = await userService.getTransactions(userId);
    
    res.status(200).json({
      data: {
        user,
        balance: user.balance,
        transactions: transactions
      }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

/**
 * POST /balance/add
 * Add money to user's balance
 */
balanceRouter.post("/add", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { amount } = req.body;
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const result = await userService.addBalance(userId, amount);
    res.status(200).json({
      data: {
        newBalance: result.user.balance,
        message: "Balance added successfully"
      }
    });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

export { balanceRouter };