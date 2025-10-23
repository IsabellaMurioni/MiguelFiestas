import bcrypt from "bcrypt";
import { JwtService } from "./jwtService";

import { db } from "../db/db";
const jwtService = new JwtService();

export class AuthService {
  async register(name: string, email: string, password: string) {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) throw new Error("El email ya está registrado");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await db.user.create({
      data: { name, email, password: hashedPassword },
    });

    const accessToken = await jwtService.generateJsonWebAccessToken(newUser);

    return { user: newUser, accessToken};
  }

  async login(email: string, password: string) {
    const user = await db.user.findUnique({ where: { email } });
    if (!user) throw new Error("Usuario no encontrado");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Contraseña incorrecta");

    const accessToken = await jwtService.generateJsonWebAccessToken(user);

    return { user, accessToken };
  }
}
