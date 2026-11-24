import { AuthenticatedUser } from "./authenticatedUser.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
    }
  }
}

export {};
