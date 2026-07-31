import type { AuthProvider } from "../../prisma/generated/client.ts";
import { prisma } from "./prisma.ts";

type SupabaseUser = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    user_name?: string;
  };
  app_metadata?: {
    provider?: string;
  };
};

function mapProvider(provider?: string): AuthProvider {
  if (provider === "github") return "Github";
  return "Google";
}

export async function upsertUserFromSupabase(supabaseUser: SupabaseUser) {
  const email = supabaseUser.email ?? `${supabaseUser.id}@users.local`;
  const name =
    supabaseUser.user_metadata?.full_name ??
    supabaseUser.user_metadata?.name ??
    supabaseUser.user_metadata?.user_name ??
    email.split("@")[0] ??
    "User";
  const provider = mapProvider(supabaseUser.app_metadata?.provider);

  return prisma.user.upsert({
    where: { supabaseId: supabaseUser.id },
    update: {
      email,
      name,
      provider,
    },
    create: {
      supabaseId: supabaseUser.id,
      email,
      name,
      provider,
    },
  });
}
