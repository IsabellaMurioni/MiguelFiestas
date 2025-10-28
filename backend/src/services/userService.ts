import { hash } from "bcrypt";
import { db } from "../db/db";
import { JwtService } from "./jwtService";
import { CreateUserBody } from "../utils/types";
import { UserValidation } from "../validations/userValidation";
const jwtService = new JwtService();

export class UserService {

  // Register
  async createUser(body: CreateUserBody) {

    UserValidation.validatePassword(body.password);
    await UserValidation.validateNicknameUsed(body.nickName);
    await UserValidation.validateEmail(body.email);
    await UserValidation.validateDni(body.dni);

    const user = await db.user.create({
      data: {
        nickName: body.nickName,
        firstName: body.firstName,
        lastName: body.lastName,
        dni: body.dni,
        email: body.email,
        password: await hash(body.password, 10)
      }
    });

    return user;

  }

  // Get Profile
  async getProfile(userID: number) {

      const user = await db.user.findUnique({
        where: { id: userID, deletedAt: null },
        select: {
          id: true,
          nickName: true,
          firstName: true,
          lastName: true,
          dni: true,
          email: true,
          balance: true,
          ticketsBought: true,
          confirmations: true
        },
      });

      if (!user) throw new Error("Usuario no encontrado");
      return user;
  }

  // Update profile
  async updateProfile(userId: number, updateData: Partial<{ firstName: string; lastName: string; email: string }>) {
      const updatedUser = await db.user.update({
        where: { id: userId, deletedAt: null },
        data: updateData,
        select: {
          id: true,
          nickName: true,
          firstName: true,
          lastName: true,
          email: true,
        },
      });

    return updatedUser;
  }

  // Get User By Id
  async getUserById(userId: number) {
      const user = await db.user.findFirst({ where: { id: userId, deletedAt: null } });
      if (!user) throw new Error("Usuario no encontrado");
      return user;
  }

  // Delete user
  async deleteUser(userId: number) {
      await this.getUserById(userId);
      return db.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });
  }

  // Add Balance (increment only)
  async addBalance(userId: number, amount: number) {
      if (amount <= 0) throw new Error("Monto inválido");

      const updatedUser = await db.user.update({
        where: { id: userId, deletedAt: null },
        data: { balance: { increment: amount } },
        select: { id: true, balance: true },
      });

      const transaction = await db.transaction.create({
        data: { userId, amount },
      });

      return { user: updatedUser, transaction };
  }

  // Subtract Balance
  async subtractBalance(userId: number, amount: number) {
      if (amount <= 0) throw new Error("Monto inválido");

      const user = await this.getUserById(userId);
      if (user.balance < amount) throw new Error("Saldo insuficiente");

      const updatedUser = await db.user.update({
        where: { id: userId, deletedAt: null },
        data: { balance: { decrement: amount } },
        select: { id: true, balance: true },
      });

      const transaction = await db.transaction.create({
        data: { userId, amount: -amount },
      });

      return { user: updatedUser, transaction };
  }


  // Transaction History
  async getTransactions(userId: number) {
      return db.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, amount: true, createdAt: true }
      });
  }

  // Increment Bought Tickets
  async incrementTickets(userId: number, count: number) {
    return db.user.update({
      where: { id: userId, deletedAt: null },
      data: { ticketsBought: { increment: count } },
      select: { id: true, ticketsBought: true },
    });
  }

  // Increment Attendance Confirmations
  async incrementConfirmations(userId: number) {
    return db.user.update({
      where: { id: userId, deletedAt: null },
      data: { confirmations: { increment: 1 } },
      select: { id: true, confirmations: true },
    });
  }

  
}
