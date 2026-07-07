import { NextRequest } from "next/server";
import { requireRetailerSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ok, fail } from "@/lib/api-response";
import { formatPaisaAsPKR } from "@/lib/money";

interface PayBody {
  amountPaisa: number;
  method: "JAZZCASH" | "EASYPAISA" | "BANK_TRANSFER" | "CASH";
  reference?: string;
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await requireRetailerSession();
    const { id: invoiceId } = await params;
    const body: PayBody = await request.json();

    if (!Number.isInteger(body.amountPaisa) || body.amountPaisa <= 0) {
      return fail(new Error("Invalid amount"), "amountPaisa must be a positive integer");
    }

    // RULE 6: this shared endpoint is still scoped to the caller's own
    // tenantId + outletId — a retailer can only pay their own shop's invoice.
    const invoice = await prisma.invoice.findFirst({
      where: {
        id: invoiceId,
        tenantId: session.tenantId,
        outletId: session.outletId,
        isDeleted: false,
      },
    });

    if (!invoice) {
      return fail(new Error("Invoice not found"), "Invoice not found");
    }

    const remainingPaisa = invoice.totalPaisa - invoice.paidPaisa;
    if (body.amountPaisa > remainingPaisa) {
      return fail(
        new Error("Overpayment"),
        `Payment exceeds remaining balance of ${formatPaisaAsPKR(remainingPaisa)}`
      );
    }

    const newPaidPaisa = invoice.paidPaisa + body.amountPaisa;
    const newStatus = newPaidPaisa >= invoice.totalPaisa ? "PAID" : "PARTIAL";

    const [updatedInvoice] = await prisma.$transaction([
      prisma.invoice.update({
        where: { id: invoice.id },
        data: { paidPaisa: newPaidPaisa, status: newStatus },
      }),
      prisma.invoicePayment.create({
        data: {
          invoiceId: invoice.id,
          amountPaisa: body.amountPaisa,
          method: body.method,
          reference: body.reference,
        },
      }),
    ]);

    return ok({
      invoiceId: updatedInvoice.id,
      status: updatedInvoice.status,
      remainingPaisa: updatedInvoice.totalPaisa - updatedInvoice.paidPaisa,
      remainingLabel: formatPaisaAsPKR(updatedInvoice.totalPaisa - updatedInvoice.paidPaisa),
    });
  } catch (error) {
    return fail(error, "Payment failed");
  }
}