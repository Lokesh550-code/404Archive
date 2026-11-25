export interface User {
  username: string;
  email: string;
  passwordHash: string;
  role: "user" | "admin" | "moderator";
  avatarKey?: string | undefined;
  isEmailVerified: boolean;
  emailVerificationTokenHash?: string | undefined;
  emailVerificationTokenExpiry?: Date | undefined;
  passwordResetTokenHash?: string | undefined;
  passwordResetTokenExpiry?: Date | undefined;
  refreshTokenHash?: string | undefined;
  refreshTokenExpiry?: Date | undefined;
  accountStatus: "active" | "suspended" | "banned";
  suspensionExpiresAt?: Date | undefined;
  createdAt: Date;
  updatedAt: Date;
}
