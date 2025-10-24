import { hash } from "bcrypt";
import { db } from "../db/db";
import { JwtService } from "./jwtService";

const jwtService = new JwtService();

interface CreateUserBody {
  nickName: string;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  password: string; 
}

export class UserService {

  // Register
  async createUser(body: CreateUserBody) {

    if (body.password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres");
    }

    await this.validateNicknameUsed(body.nickName)
    await this.validateEmail(body.email)
    await this.validateDni(body.dni)

    const existingUser = await db.user.findFirst({
      where: { email: body.email, deletedAt: null }
    });

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
  async getProfile(accessToken: string) {
    try {
      const decoded = await jwtService.verifyAccessToken(accessToken);
      if (!decoded) throw new Error("Token inválido");

      const user = await db.user.findFirst({
        where: { id: decoded.id, deletedAt: null },
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

    } catch (error: any) {
      console.error("Error al obtener perfil:", error);
      throw new Error("No se pudo obtener el perfil");
    }
  }

  // Update profile
  async updateProfile(userId: number, updateData: Partial<{ firstName: string; lastName: string; email: string }>) {
    try {
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
    } catch (error: any) {
      console.error("Error al actualizar perfil:", error);
      throw new Error("No se pudo actualizar el perfil");
    }
  }

  // Get User By Id
  async getUserById(userId: number) {
    try {
      const user = await db.user.findFirst({ where: { id: userId, deletedAt: null } });
      if (!user) throw new Error("Usuario no encontrado");
      return user;
    } catch (error: any) {
      console.error("Error al buscar usuario por ID:", error);
      throw new Error("No se pudo obtener el usuario");
    }
  }

  // Delete user
  async deleteUser(userId: number) {
    try {
      await this.getUserById(userId); // Verifica existencia
      return db.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() },
      });
    } catch (error: any) {
      console.error("Error al eliminar usuario:", error);
      throw new Error("No se pudo eliminar el usuario");
    }
  }

  // Add Balance
  async addBalance(userId: number, amount: number) {
    try {
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
    } catch (error: any) {
      console.error("Error al agregar saldo:", error);
      throw new Error("No se pudo agregar saldo");
    }
  }

  // Transaction History
  async getTransactions(userId: number) {
    try {
      return db.transaction.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        select: { id: true, amount: true, createdAt: true }
      });
    } catch (error: any) {
      console.error("Error al obtener transacciones:", error);
      throw new Error("No se pudo obtener el historial de transacciones");
    }
  }

  // Increment Bought Tickets
  async incrementTickets(userId: number, count: number) {
    try {
      const updatedUser = await db.user.update({
        where: { id: userId, deletedAt: null },
        data: { ticketsBought: { increment: count } },
        select: { id: true, ticketsBought: true },
      });
      return updatedUser;
    } catch (error: any) {
      console.error("Error al incrementar tickets:", error);
      throw new Error("No se pudo actualizar tickets");
    }
  }

  // Increment Attendance Confirmations
  async incrementConfirmations(userId: number) {
    try {
      const updatedUser = await db.user.update({
        where: { id: userId, deletedAt: null },
        data: { confirmations: { increment: 1 } },
        select: { id: true, confirmations: true },
      });
      return updatedUser;
    } catch (error: any) {
      console.error("Error al incrementar confirmaciones:", error);
      throw new Error("No se pudo actualizar confirmaciones");
    }
  }

  // VALIDADORES 

  async validateNicknameUsed(nickname: string) {

    const user = await db.user.findUnique({
      where: {
        nickName: nickname
      }
    })

    if (user) {
      throw new Error(`El nickname ${nickname} ya esta utilizado.`)
    }

  }

  async validateDni(dni: string){
    if (!/^\d{7,9}$/.test(dni)) {
      throw new Error("El DNI debe contener solo números y tener entre 7 y 9 dígitos.");
    }

    const existingUser = await db.user.findFirst({
      where: { dni, deletedAt: null },
    });

    if (existingUser) {
      throw new Error(`El DNI ${dni} ya está registrado.`);
    }
  }

  async validateEmail(email: string){
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("El formato del email no es válido.");
    }

    const existingUser = await db.user.findFirst({
      where: { email, deletedAt: null },
    });

    if (existingUser) {
      throw new Error(`El email ${email} ya está registrado.`);
    }
  }
}
