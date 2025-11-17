export class AuthValidation {
  // Email
  static validateEmailFormat(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) throw new Error("Invalid email format");
  }

  // Password
  static validatePasswordNotEmpty(password: string) {
    if (!password || password.length === 0) throw new Error("Password cannot be empty");
  }
}
