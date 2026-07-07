import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import { formatPaisaAsPKR } from "@/lib/money";

interface InvoicePdfItem {
  name: string;
  quantity: number;
  pricePaisa: number;
}

interface InvoicePdfPayment {
  date: Date;
  amountPaisa: number;
  method: string;
}

interface InvoicePdfInput {
  invoiceId: string;
  outletName: string;
  outletAddress: string;
  dueDate: Date;
  createdAt: Date;
  status: string;
  items: InvoicePdfItem[];
  payments: InvoicePdfPayment[];
  totalPaisa: number;
  paidPaisa: number;
}

export async function generateInvoicePdf(input: InvoicePdfInput): Promise<Uint8Array> {
  const doc = await PDFDocument.create();
  const page = doc.addPage([420, 595]);
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  const margin = 40;
  let y = 555;

  const drawText = (
    text: string,
    options: { size?: number; bold?: boolean; color?: [number, number, number] } = {}
  ) => {
    page.drawText(text, {
      x: margin,
      y,
      size: options.size ?? 10,
      font: options.bold ? boldFont : font,
      color: options.color ? rgb(...options.color) : rgb(0.06, 0.09, 0.16),
    });
    y -= (options.size ?? 10) + 8;
  };

  drawText("DistributeOS — Invoice", { size: 16, bold: true });
  drawText(input.invoiceId, { size: 11, bold: true, color: [0.03, 0.35, 0.44] });
  y -= 4;

  drawText(`Billed to: ${input.outletName}`, { size: 10 });
  if (input.outletAddress) {
    drawText(input.outletAddress, { size: 9, color: [0.4, 0.46, 0.55] });
  }
  drawText(`Invoice date: ${input.createdAt.toDateString()}`, { size: 9, color: [0.4, 0.46, 0.55] });
  drawText(`Due date: ${input.dueDate.toDateString()}`, { size: 9, color: [0.4, 0.46, 0.55] });
  drawText(`Status: ${input.status}`, { size: 9, bold: true });
  y -= 10;

  drawText("Items", { size: 11, bold: true });
  y -= 2;
  for (const item of input.items) {
    const lineTotal = item.quantity * item.pricePaisa;
    drawText(`${item.name}  x${item.quantity}   ${formatPaisaAsPKR(lineTotal)}`, { size: 9 });
  }

  y -= 6;
  drawText(`Total: ${formatPaisaAsPKR(input.totalPaisa)}`, { size: 11, bold: true });
  drawText(`Paid: ${formatPaisaAsPKR(input.paidPaisa)}`, { size: 10 });
  drawText(`Balance: ${formatPaisaAsPKR(input.totalPaisa - input.paidPaisa)}`, {
    size: 10,
    bold: true,
  });

  if (input.payments.length > 0) {
    y -= 10;
    drawText("Payment History", { size: 11, bold: true });
    for (const payment of input.payments) {
      drawText(
        `${payment.date.toDateString()} — ${formatPaisaAsPKR(payment.amountPaisa)} via ${payment.method}`,
        { size: 9 }
      );
    }
  }

  return doc.save();
}