export interface AccessTokenPayload {
  sub: string;
  role: "user" | "admin" | "moderator";
}
