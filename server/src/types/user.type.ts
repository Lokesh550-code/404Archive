export interface User {
  username: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin" | "moderator";
  avatarKey?: string;
  isEmailVerified: boolean;
  emailVerificationTokenHash?: string;
  emailVerificationTokenExpiry?: Date;
  passwordResetTokenHash?: string;
  passwordResetTokenExpiry?: Date;
  refreshTokenHash?: string;
  refreshTokenExpiry?: Date;
  accountStatus: "active" | "suspended" | "banned";
  suspensionExpiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
