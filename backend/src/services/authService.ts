import bcrypt from "bcrypt"
import { db } from "../db/db";
import { JwtService } from "./jwtService";
import { AuthValidation } from "../validations/authValidation";

const jwtService = new JwtService();

export class AuthService {
  // Login
  async login(email: string, password: string) {
    AuthValidation.validateEmailFormat(email);
    AuthValidation.validatePasswordNotEmpty(password);

    const user = await db.user.findUnique({ 
      where: { email } 
    });
  
    if (!user) throw new Error("Email incorrecto.");

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) throw new Error("Contraseña incorrectos");

    const accessToken = await jwtService.generateJsonWebAccessToken(user);

    return { user, accessToken };
  }

  // Logout
  async logout(res: any) {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    });

    return { message: "Logout exitoso. Sesión finalizada." };
  }
}

export const authService = new AuthService();