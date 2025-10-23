import jwt from "jsonwebtoken";

type jsonwebtokenBody = {
  id: number;
  email: string;
};

const secret_key = process.env.JWT_SECRET;

export class JwtService {
  async generateJsonWebAccessToken(user: jsonwebtokenBody) {
    try {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        secret_key as string,
        { expiresIn: "24h" }
      );
      return token;
    } catch (error) {
      console.error(error);
      throw new Error(`Error al generar token JWT. Mira los logs para más información.`);
    }
  }

  async verifyAccessToken(token: string) {
    try {
      const decoded = jwt.verify(token, secret_key as string) as { id: number; email: string };
      return decoded;
    } catch (error) {
      console.error(error);
      throw new Error("Token inválido o expirado");
    }
  }
}
