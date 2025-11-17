import { db } from "../db/db";

export class UserValidation {

  // Password
  static validatePassword(password: string) {
    if (password.length < 6) {
      throw new Error("The password needs to have at least 6 letters.");
    }
  }

  // Nickname
  static async validateNicknameUsed(nickName: string) {
    const user = await db.user.findUnique({ where: { nickName } });
    if (user) throw new Error(`The nickname ${nickName} is already used.`);
  }

  // Email
  static async validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Email not valid.");
    }

    const existingUser = await db.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (existingUser) throw new Error(`The email ${email} is already registered.`);
  }

  // Dni
  static async validateDni(dni: string) {
    if (!/^\d{7,9}$/.test(dni)) {
      throw new Error("The ID has to contain only numbers and it needs to have between 7-9 digits.");
    }

    const existingUser = await db.user.findFirst({
      where: { dni, deletedAt: null },
    });
    if (existingUser) throw new Error(`The ID ${dni} is already registered.`);
  }
}
