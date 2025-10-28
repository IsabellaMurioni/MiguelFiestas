import jwt from "jsonwebtoken";
import { JsonWebTokenBody } from "../utils/types";

const secret_key = process.env.JWT_SECRET;

export class JwtService {
  
  // Json Web Access Token
  async generateJsonWebAccessToken(user: JsonWebTokenBody) {
      const token = jwt.sign(
        { id: user.id, email: user.email },
        secret_key as string,
        { expiresIn: "48h" }
      );
      return token;
  }

  // Verify token
  async verifyAccessToken(token: string) {
      const decoded = jwt.verify(token, secret_key as string) as { id: number; email: string };
      return decoded;
  }
}
