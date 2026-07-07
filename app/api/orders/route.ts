import { NextRequest } from "next/server";
import { requireRetailerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { formatPaisaAsPKR } from "@/lib/money";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

interface PlaceOrderBody {
  items: OrderItemInput[];
  notes?: string;
  deliveryDate?: string;
}

export async function POST(request: NextRequest) {
  try {
    const session = await requireRetailerSession();
    const body: PlaceOrderBody = await request.json();

    if (!Array.isArray(body.items) || body.items.length === 0) {
      return fail(
        new Error("Empty cart"),
        "Order must contain at least one item",
      );
    }

    for (const item of body.items) {
      if (
        !item.productId ||
        !Number.isInteger(item.quantity) ||
        item.quantity <= 0
      ) {
        return fail(
          new Error("Invalid item"),
          "Each item needs a valid productId and quantity",
        );
      }
    }

    // RULE 1: products looked up scoped to tenantId — a retailer can only
    // order products their own distribution company actually sells.
    const productIds = body.items.map((i) => i.productId);
    const products = await prisma.product.findMany({
      where: {
        id: { in: productIds },
        tenantId: session.tenantId,
        isDeleted: false,
      },
    });

    if (products.length !== productIds.length) {
      return fail(
        new Error("Unknown product"),
        "One or more products are invalid",
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));

    // Verify live stock (StockLedger sum) covers each requested quantity.
    const stockSums = await prisma.stockLedger.groupBy({
      by: ["productId"],
      where: { tenantId: session.tenantId, productId: { in: productIds } },
      _sum: { quantity: true },
    });
    const stockByProduct = new Map(
      stockSums.map((s) => [s.productId, s._sum.quantity ?? 0]),
    );

    for (const item of body.items) {
      const available = stockByProduct.get(item.productId) ?? 0;
      if (item.quantity > available) {
        const name = productMap.get(item.productId)?.name ?? item.productId;
        return fail(
          new Error("Insufficient stock"),
          `Only ${available} ctns of "${name}" left in stock`,
        );
      }
    }

    const totalPaisa = body.items.reduce((sum, item) => {
      const product = productMap.get(item.productId)!;
      return sum + product.pricePaisa * item.quantity;
    }, 0);

    const deliveryDate = body.deliveryDate ? new Date(body.deliveryDate) : null;

    // RULE 6: order is created for the caller's own outletId — never a
    // client-supplied outletId, since that would let a retailer place
    // orders on behalf of a different shop.
const order = await prisma.$transaction(
      async (tx) => {      const orderNo = `ORD-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      const created = await tx.order.create({
        data: {
          orderNo,
          tenantId: session.tenantId,
          outletId: session.outletId,
          status: "PENDING",
          totalPaisa,
          notes: body.notes,
          deliveryDate,
          items: {
            create: body.items.map((item) => {
              const product = productMap.get(item.productId)!;
              return {
                productId: product.id,
                name: product.name,
                quantity: item.quantity,
                pricePaisa: product.pricePaisa,
              };
            }),
          },
        },
        include: { items: true },
      });

     // Deduct stock: one negative StockLedger entry per line item.
      await tx.stockLedger.createMany({
        data: body.items.map((item) => ({
          tenantId: session.tenantId,
          productId: item.productId,
          quantity: -item.quantity,
          reason: `Order ${created.id}`,
        })),
      });

     // Auto-generate the invoice for this order (15-day payment terms).
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 15);
      const invoiceNo = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      await tx.invoice.create({
        data: {
          invoiceNo,
          tenantId: session.tenantId,
          outletId: session.outletId,
          orderId: created.id,
          totalPaisa,
          paidPaisa: 0,
          status: "PENDING",
          dueDate,
          items: {
            create: created.items.map((item) => ({
              productId: item.productId,
              name: item.name,
              quantity: item.quantity,
              pricePaisa: item.pricePaisa,
            })),
          },
        },
      });

      return created;
    },
      { timeout: 15000, maxWait: 10000 }
    );
    return ok({
      id: order.id,
      orderNo: order.orderNo,
      status: order.status,
      totalPaisa: order.totalPaisa,
      totalLabel: formatPaisaAsPKR(order.totalPaisa),
      itemCount: order.items.length,
      createdAt: order.createdAt.toISOString(),
    });
  } catch (error) {
    return fail(error, "Failed to place order");
  }
}
