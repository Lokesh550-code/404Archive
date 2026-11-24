import { AccessTokenPayload } from "./accessTokenPayload.ts";

declare global {
  namespace Express {
    interface Request {
      user?: AccessTokenPayload;
    }
  }
}

export {};
