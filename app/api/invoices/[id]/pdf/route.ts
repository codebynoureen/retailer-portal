import { NextRequest, NextResponse } from "next/server";
import { requireRetailerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fail } from "@/lib/api-response";
import { generateInvoicePdf } from "@/lib/pdf/generateInvoicePdf";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRetailerSession();
    const { id: invoiceId } = await params;

    // RULE 6: even a shared endpoint stays scoped to the caller's own
    // tenantId + outletId — a retailer can only download their own invoice.
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        tenantId: session.tenantId,
        outletId: session.outletId,
        isDeleted: false,
      },
      include: {
        items: true,
        payments: { orderBy: { createdAt: "asc" } },
        outlet: true,
      },
    });

    if (!invoice) {
      return fail(new Error("Invoice not found"), "Invoice not found");
    }

    const pdfBytes = await generateInvoicePdf({
      invoiceId: invoice.invoiceNo,
      outletName: invoice.outlet.name,
      outletAddress: invoice.outlet.address ?? "",
      dueDate: invoice.dueDate,
      createdAt: invoice.createdAt,
      status: invoice.status,
      items: invoice.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        pricePaisa: item.pricePaisa,
      })),
      payments: invoice.payments.map((p) => ({
        date: p.createdAt,
        amountPaisa: p.amountPaisa,
        method: p.method,
      })),
      totalPaisa: invoice.totalPaisa,
      paidPaisa: invoice.paidPaisa,
    });

    return new NextResponse(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `inline; filename="${invoice.id}.pdf"`,
      },
    });
  } catch (error) {
    return fail(error, "Failed to generate invoice PDF");
  }
}