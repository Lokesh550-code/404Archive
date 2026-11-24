export interface AuthenticatedUser {
  sub: string;
  role: "user" | "admin" | "moderator";
  accountStatus?: "active" | "suspended" | "banned";
}
