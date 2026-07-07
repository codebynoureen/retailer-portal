import { requireRetailerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";

export async function GET() {
  try {
    const session = await requireRetailerSession();

    const [outlet, user] = await Promise.all([
      prisma.outlet.findFirst({
        where: { id: session.outletId, tenantId: session.tenantId },
      }),
      prisma.user.findUnique({ where: { id: session.userId } }),
    ]);

    if (!outlet) {
      return fail(new Error("Outlet not found"), "Outlet not found");
    }

    return ok({
      outletName: outlet.name,
      outletAddress: outlet.address ?? "",
      userName: user?.name ?? outlet.name,
    });
  } catch (error) {
    return fail(error, "Failed to load profile");
  }
}