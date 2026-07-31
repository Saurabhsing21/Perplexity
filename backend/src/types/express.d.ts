import type { User } from "../../prisma/generated/client.ts";

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

declare global {
  namespace Express {
    interface Request {
      user?: User;
      supabaseUser?: SupabaseJwtUser;
    }
  }
}

export {};
