import type { NextFunction, Request, Response } from "express";
import { createRemoteJWKSet, jwtVerify } from "jose";
import { upsertUserFromSupabase } from "../db/user-sync.ts";

type SupabaseJwtUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    avatar_url?: string;
    user_name?: string;
  };
  app_metadata?: {
    provider?: string;
  };
};

const supabaseUrl = process.env.SUPABASE_URL ?? process.env.VITE_SUPABASE_URL;
const jwks = supabaseUrl
  ? createRemoteJWKSet(new URL(`${supabaseUrl}/auth/v1/.well-known/jwks.json`))
  : null;

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      return res.status(401).json({ error: "unauthorized", message: "Missing auth token" });
    }

    if (!jwks) {
      return res.status(500).json({ error: "server_misconfigured", message: "SUPABASE_URL is not set" });
    }

    const token = header.slice("Bearer ".length);
    const { payload } = await jwtVerify(token, jwks);

    const sub = payload.sub;
    if (!sub) {
      return res.status(401).json({ error: "unauthorized", message: "Invalid token subject" });
    }

    const supabaseUser: SupabaseJwtUser = {
      id: sub,
      email: typeof payload.email === "string" ? payload.email : undefined,
      user_metadata: (payload.user_metadata as SupabaseJwtUser["user_metadata"]) ?? {},
      app_metadata: (payload.app_metadata as SupabaseJwtUser["app_metadata"]) ?? {},
    };

    req.supabaseUser = supabaseUser;
    req.user = await upsertUserFromSupabase(supabaseUser);
    next();
  } catch (error) {
    console.error("[auth] Token verification failed:", error);
    return res.status(401).json({ error: "unauthorized", message: "Invalid or expired token" });
  }
}
