import { compare } from "bcrypt";
import { db } from "../db/db";
import { JwtService } from "./jwtService";

const jwtService = new JwtService();

export class AuthService {

  // Login + VerifyLogin
  async login(email: string, password: string) {
    try {
      const user = await db.user.findUnique({ where: { email } });
      if (!user) throw new Error("Email o contraseña incorrectos");

      const validPassword = await compare(password, user.password);
      if (!validPassword) throw new Error("Email o contraseña incorrectos");

      const accessToken = await jwtService.generateJsonWebAccessToken(user);
      return { user, accessToken };

    } catch (error) {
      console.error(error);
      throw new Error("Error al autenticar usuario");
    }
  }

}

export const authService = new AuthService()