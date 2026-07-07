import { requireRetailerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { formatPaisaAsPKR } from "@/lib/money";

export async function GET() {
  try {
    const session = await requireRetailerSession();

    // RULE 1: scoped to tenantId. Catalogue is shared across all outlets
    // of the same tenant (a distribution company's product list is the
    // same for every shop it sells to) — unlike Invoices/Orders, this one
    // does NOT filter by outletId, only tenantId.
    const products = await prisma.product.findMany({
      where: { tenantId: session.tenantId, isDeleted: false },
      orderBy: { name: "asc" },
    });

    // Live stock = sum of all StockLedger movements for that product
    // (positive entries = stock in, negative = stock out/sold).
    const stockSums = await prisma.stockLedger.groupBy({
      by: ["productId"],
      where: { tenantId: session.tenantId },
      _sum: { quantity: true },
    });
    const stockByProduct = new Map(stockSums.map((s) => [s.productId, s._sum.quantity ?? 0]));

    const catalogue = products.map((product) => {
      const stock = stockByProduct.get(product.id) ?? 0;
      return {
        id: product.id,
        name: product.name,
        unit: product.unit,
        pricePaisa: product.pricePaisa,
        priceLabel: `${formatPaisaAsPKR(product.pricePaisa)} / ${product.unit}`,
        stock,
        inStock: stock > 0,
      };
    });

    return ok({ products: catalogue });
  } catch (error) {
    return fail(error, "Failed to load catalogue");
  }
}