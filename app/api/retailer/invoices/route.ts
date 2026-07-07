import { NextRequest } from "next/server";
import { InvoiceStatus, Prisma } from "@prisma/client";
import { requireRetailerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { formatPaisaAsPKR } from "@/lib/money";

export async function GET(request: NextRequest) {
  try {
    const session = await requireRetailerSession();
    const { searchParams } = new URL(request.url);

    const statusParam = searchParams.get("status");
    const search = searchParams.get("search")?.trim();
    const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1);
    const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") ?? "5", 10), 1), 50);

    const validStatuses = Object.values(InvoiceStatus) as string[];
    const statusFilter =
      statusParam && validStatuses.includes(statusParam) ? (statusParam as InvoiceStatus) : null;

    // RULE 6: filter by BOTH tenantId AND outletId — never outletId alone,
    // never tenantId alone.
    const where: Prisma.InvoiceWhereInput = {
      tenantId: session.tenantId,
      outletId: session.outletId,
      isDeleted: false,
    };
    if (statusFilter) where.status = statusFilter;
    if (search) where.id = { contains: search, mode: "insensitive" };

    const [invoices, total] = await prisma.$transaction([
      prisma.invoice.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
      prisma.invoice.count({ where }),
    ]);

    const now = new Date();
    const invoiceList = invoices.map((inv) => {
      const remainingPaisa = inv.totalPaisa - inv.paidPaisa;
      const isOverdue = inv.dueDate < now && remainingPaisa > 0;
      const effectiveStatus = isOverdue ? "OVERDUE" : inv.status;

     return {
        id: inv.id,
        invoiceNo: inv.invoiceNo,
        totalPaisa: inv.totalPaisa,
        totalLabel: formatPaisaAsPKR(inv.totalPaisa),
        paidPaisa: inv.paidPaisa,
        remainingPaisa,
        remainingLabel: formatPaisaAsPKR(remainingPaisa),
        status: effectiveStatus,
        dueDate: inv.dueDate.toISOString(),
        createdAt: inv.createdAt.toISOString(),
      };
    });

    return ok({
      invoices: invoiceList,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    });
  } catch (error) {
    return fail(error, "Failed to load invoices");
  }
}