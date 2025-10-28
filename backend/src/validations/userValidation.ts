import { db } from "../db/db";

export class UserValidation {

  // Password
  static validatePassword(password: string) {
    if (password.length < 6) {
      throw new Error("La contraseña debe tener al menos 6 caracteres.");
    }
  }

  // Nickname
  static async validateNicknameUsed(nickName: string) {
    const user = await db.user.findUnique({ where: { nickName } });
    if (user) throw new Error(`El nickname ${nickName} ya está utilizado.`);
  }

  // Email
  static async validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("El formato del email no es válido.");
    }

    const existingUser = await db.user.findFirst({
      where: { email, deletedAt: null },
    });
    if (existingUser) throw new Error(`El email ${email} ya está registrado.`);
  }

  // Dni
  static async validateDni(dni: string) {
    if (!/^\d{7,9}$/.test(dni)) {
      throw new Error("El DNI debe contener solo números y tener entre 7 y 9 dígitos.");
    }

    const existingUser = await db.user.findFirst({
      where: { dni, deletedAt: null },
    });
    if (existingUser) throw new Error(`El DNI ${dni} ya está registrado.`);
  }
}
