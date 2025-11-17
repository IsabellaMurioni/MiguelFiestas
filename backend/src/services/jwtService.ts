import jwt from "jsonwebtoken";

const secret_key = process.env.JWT_SECRET;

export class JwtService {
  
  // Json Web Access Token
  async generateJsonWebAccessToken(userID: number, email: string) {

      const token = jwt.sign(
        { id: userID, email: email },
        secret_key as string,
        { expiresIn: "48h" }
      );

      return token
  }

  // Verify token
  async verifyAccessToken(token: string) {
      const decoded = jwt.verify(token, secret_key as string) as { id: number; email: string };
      return decoded;
  }
}
