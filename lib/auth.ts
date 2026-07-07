import { createSupabaseServerClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export class AuthError extends Error {
  status: number;
  constructor(message: string, status = 401) {
    super(message);
    this.status = status;
  }
}

export interface RetailerSession {
  userId: string;
  tenantId: string;
  outletId: string;
  role: "RETAILER";
}

/**
 * Verifies the Supabase session and resolves the caller to a RETAILER
 * user scoped to exactly one tenantId + outletId.
 * Throws AuthError if unauthenticated, wrong role, or user has no outlet.
 */
export async function requireRetailerSession(): Promise<RetailerSession> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthError("Not authenticated", 401);
  }

  const dbUser = await prisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!dbUser) {
    throw new AuthError("User not found", 401);
  }

  if (dbUser.role !== "RETAILER") {
    throw new AuthError("Only retailer accounts may access this endpoint", 403);
  }

  if (!dbUser.outletId) {
    throw new AuthError("Retailer account has no linked outlet", 403);
  }

  return {
    userId: dbUser.id,
    tenantId: dbUser.tenantId,
    outletId: dbUser.outletId,
    role: "RETAILER",
  };
}