import { NextRequest } from "next/server";
import { OrderStatus, Prisma } from "@prisma/client";
import { requireRetailerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { formatPaisaAsPKR } from "@/lib/money";

export async function GET(request: NextRequest) {
  try {
    const session = await requireRetailerSession();
    const { searchParams } = new URL(request.url);

    const statusParam = searchParams.get("status");
    const page = Math.max(parseInt(searchParams.get("page") ?? "1", 10), 1);
    const pageSize = Math.min(Math.max(parseInt(searchParams.get("pageSize") ?? "10", 10), 1), 50);

    const validStatuses = Object.values(OrderStatus) as string[];
    const statusFilter =
      statusParam && validStatuses.includes(statusParam) ? (statusParam as OrderStatus) : null;

    // RULE 6: filter by BOTH tenantId AND outletId.
    const where: Prisma.OrderWhereInput = {
      tenantId: session.tenantId,
      outletId: session.outletId,
      isDeleted: false,
    };
    if (statusFilter) where.status = statusFilter;

    const [orders, total] = await prisma.$transaction([
      prisma.order.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
        include: { items: true },
      }),
      prisma.order.count({ where }),
    ]);

   const orderList = orders.map((order) => ({
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      totalPaisa: order.totalPaisa,
      totalLabel: formatPaisaAsPKR(order.totalPaisa),
      itemCount: order.items.length,
      deliveryDate: order.deliveryDate?.toISOString() ?? null,
      createdAt: order.createdAt.toISOString(),
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        pricePaisa: item.pricePaisa,
      })),
    }));

    return ok({
      orders: orderList,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(Math.ceil(total / pageSize), 1),
      },
    });
  } catch (error) {
    return fail(error, "Failed to load orders");
  }
}