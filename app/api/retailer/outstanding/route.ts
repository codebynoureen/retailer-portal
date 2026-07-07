import { requireRetailerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { formatPaisaAsPKR } from "@/lib/money";

export async function GET() {
  try {
    const session = await requireRetailerSession();

    // RULE 6: filter by BOTH tenantId AND outletId — never outletId alone,
    // never tenantId alone.
    const unpaidInvoices = await prisma.invoice.findMany({
      where: {
        tenantId: session.tenantId,
        outletId: session.outletId,
        isDeleted: false,
        status: { in: ["PENDING", "PARTIAL", "OVERDUE"] },
      },
      orderBy: { dueDate: "asc" },
    });

    const outlet = await prisma.outlet.findFirst({
      where: { id: session.outletId, tenantId: session.tenantId },
    });

    if (!outlet) {
      return fail(new Error("Outlet not found"), "Outlet not found");
    }

    const now = new Date();
    const invoiceList = unpaidInvoices.map((inv) => {
      const remainingPaisa = inv.totalPaisa - inv.paidPaisa;
      const isOverdue = inv.dueDate < now && remainingPaisa > 0;
      const daysOverdue = isOverdue
        ? Math.floor((now.getTime() - inv.dueDate.getTime()) / (1000 * 60 * 60 * 24))
        : 0;

      return {
        id: inv.id,
        invoiceNo: inv.invoiceNo,
        amountPaisa: remainingPaisa,
        amountLabel: formatPaisaAsPKR(remainingPaisa),
        status: isOverdue ? "OVERDUE" : inv.status,
        dueDate: inv.dueDate.toISOString(),
        daysOverdue,
      };
    });

    const totalOutstandingPaisa = invoiceList.reduce((sum, inv) => sum + inv.amountPaisa, 0);
    const overdueCount = invoiceList.filter((inv) => inv.status === "OVERDUE").length;
    const oldestOverdueDays = invoiceList.reduce(
      (max, inv) => Math.max(max, inv.daysOverdue),
      0
    );
    const availableCreditPaisa = Math.max(
      outlet.creditLimitPaisa - totalOutstandingPaisa,
      0
    );

 return ok({
      outletId: outlet.id,
      outletName: outlet.name,
      outletAddress: outlet.address ?? "",
      creditLimitPaisa: outlet.creditLimitPaisa,
      creditLimitLabel: formatPaisaAsPKR(outlet.creditLimitPaisa),
      totalOutstandingPaisa,
      totalOutstandingLabel: formatPaisaAsPKR(totalOutstandingPaisa),
      availableCreditPaisa,
      availableCreditLabel: formatPaisaAsPKR(availableCreditPaisa),
      percentUsed:
        outlet.creditLimitPaisa > 0
          ? Math.round((totalOutstandingPaisa / outlet.creditLimitPaisa) * 100)
          : 0,
      overdueCount,
      oldestOverdueDays,
      invoices: invoiceList,
    });
  } catch (error) {
    return fail(error, "Failed to load outstanding balance");
  }
}