import { db } from "../db/db";
import { JwtService } from "./jwtService";
const jwtService = new JwtService();

export class UserService {
  
  async getProfile(accessToken: string) {
    const decoded = await jwtService.verifyAccessToken(accessToken);
    if (!decoded) throw new Error("Token inválido");

    const user = await db.user.findUnique({
      where: { id: decoded.id },
      select: {
        id: true,
        nickName: true,
        firstName: true,
        lastName: true,
        dni: true,
        email: true,
        balance: true,
        ticketsBought: true,
        confirmations: true,
        createdAt: true,
      },
    });

    if (!user) throw new Error("Usuario no encontrado");
    return user;
  }

  // Actualizar perfil de usuario
  async updateProfile(userId: number, updateData: Partial<{
    nickName: string;
    firstName: string;
    lastName: string;
    email: string;
  }>) {
    const updatedUser = await db.user.update({
      where: { id: userId },
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

// agrega saldo al user
  async addBalance(userId: number, amount: number) {
    if (amount <= 0) throw new Error("Monto inválido");

    // Actualizar el saldo del usuario
    const updatedUser = await db.user.update({
        where: { id: userId },
        data: { balance: { increment: amount } },
        select: { id: true, balance: true },
    });

    // Crear la transacción relacionada
    const transaction = await db.transaction.create({
        data: {
        userId,
        amount,
        // createdAt se asigna automáticamente por default
        },
    });

    // Retornar usuario actualizado y la transacción
    return { user: updatedUser, transaction };
    }


  // Obtener historial de transacciones del usuario
  async getTransactions(userId: number) {
  const transactions = await db.transaction.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }, // las más recientes primero
    select: {
      id: true,
      amount: true,
      createdAt: true,
    },
  });

  return transactions;
}


  // Incrementar tickets comprados
  async incrementTickets(userId: number, count: number) {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { ticketsBought: { increment: count } },
      select: { id: true, ticketsBought: true },
    });
    return updatedUser;
  }

  // Incrementar confirmaciones de asistencia 
  async incrementConfirmations(userId: number) {
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: { confirmations: { increment: 1 } },
      select: { id: true, confirmations: true },
    });
    return updatedUser;
  }

}
