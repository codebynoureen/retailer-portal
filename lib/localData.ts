import staticInvoices, { type Invoice } from "@/data/invoices";
import staticOrders, { type PastOrder } from "@/data/orders";

const INVOICES_KEY = "extraInvoices";
const ORDERS_KEY = "extraOrders";
const INVOICE_OVERRIDES_KEY = "invoiceOverrides";
const ORDER_OVERRIDES_KEY = "orderOverrides";

export function getExtraInvoices(): Invoice[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(INVOICES_KEY);
    return raw ? (JSON.parse(raw) as Invoice[]) : [];
  } catch {
    return [];
  }
}

export function addExtraInvoice(invoice: Invoice) {
  const current = getExtraInvoices();
  localStorage.setItem(INVOICES_KEY, JSON.stringify([invoice, ...current]));
}

export function getExtraOrders(): PastOrder[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(ORDERS_KEY);
    return raw ? (JSON.parse(raw) as PastOrder[]) : [];
  } catch {
    return [];
  }
}

export function addExtraOrder(order: PastOrder) {
  const current = getExtraOrders();
  localStorage.setItem(ORDERS_KEY, JSON.stringify([order, ...current]));
}

/* ─────────────────────────────────────────────────────────
   INVOICE PAYMENT STATUS — overrides
───────────────────────────────────────────────────────── */

type InvoiceOverride = Pick<Invoice, "status" | "amount" | "payments">;

function getInvoiceOverrides(): Record<string, InvoiceOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(INVOICE_OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, InvoiceOverride>) : {};
  } catch {
    return {};
  }
}

function setInvoiceOverride(id: string, override: InvoiceOverride) {
  const current = getInvoiceOverrides();
  current[id] = override;
  localStorage.setItem(INVOICE_OVERRIDES_KEY, JSON.stringify(current));
}

/** Pakistani lakh-style digit grouping, e.g. 184500 -> "PKR 1,84,500" */
function formatPKR(amount: number): string {
  const value = Math.max(Math.round(amount), 0).toString();
  const lastThree = value.slice(-3);
  const otherDigits = value.slice(0, -3);
  const grouped = otherDigits
    ? `${otherDigits.replace(/\B(?=(\d{2})+(?!\d))/g, ",")},${lastThree}`
    : lastThree;
  return `PKR ${grouped}`;
}

function parsePKR(amount: string): number {
  return Number(amount.replace(/[^0-9]/g, "")) || 0;
}

export function getMergedInvoices(): Invoice[] {
  const base = [...getExtraInvoices(), ...staticInvoices];
  const overrides = getInvoiceOverrides();

  return base.map((invoice) =>
    overrides[invoice.id] ? { ...invoice, ...overrides[invoice.id] } : invoice
  );
}

/* ─────────────────────────────────────────────────────────
   ORDER STATUS — overrides
   Same pattern as invoices: static + extra orders are read-only,
   so a status change (Processing / Delivered) is stored as a
   small override per order id and merged on top when reading.
───────────────────────────────────────────────────────── */

type OrderOverride = Pick<PastOrder, "status">;

function getOrderOverrides(): Record<string, OrderOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(ORDER_OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, OrderOverride>) : {};
  } catch {
    return {};
  }
}

function setOrderOverride(id: string, override: OrderOverride) {
  const current = getOrderOverrides();
  current[id] = override;
  localStorage.setItem(ORDER_OVERRIDES_KEY, JSON.stringify(current));
}

export function getMergedOrders(): PastOrder[] {
  const base = [...getExtraOrders(), ...staticOrders];
  const overrides = getOrderOverrides();

  return base.map((order) =>
    overrides[order.id] ? { ...order, ...overrides[order.id] } : order
  );
}

/** Manually change an order's status, e.g. mark it "Delivered". */
export function updateOrderStatus(
  orderId: string,
  status: PastOrder["status"]
) {
  setOrderOverride(orderId, { status });
}

/**
 * Records a payment against an invoice and updates its status:
 * - remaining balance <= 0  -> "Paid"
 * - otherwise               -> "Partial"
 * When an invoice becomes fully "Paid", the order linked to it
 * (via invoiceId) automatically moves from "Pending" to
 * "Processing" — unless it's already "Delivered".
 * Returns the updated invoice, or null if the invoice wasn't found.
 */
export function payInvoice(
  invoiceId: string,
  amountPaid: number,
  method: string
): Invoice | null {
  const current = getMergedInvoices().find((inv) => inv.id === invoiceId);
  if (!current) return null;

  const remaining = parsePKR(current.amount) - amountPaid;
  const newStatus = remaining <= 0 ? "Paid" : "Partial";

  const today = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const updatedInvoice: Invoice = {
    ...current,
    amount: formatPKR(remaining),
    status: newStatus,
    payments: [
      ...current.payments,
      { date: today, amount: formatPKR(amountPaid), method },
    ],
  };

  setInvoiceOverride(invoiceId, {
    status: updatedInvoice.status,
    amount: updatedInvoice.amount,
    payments: updatedInvoice.payments,
  });

  if (newStatus === "Paid") {
    const relatedOrder = getMergedOrders().find(
      (order) => order.invoiceId === invoiceId
    );
    if (relatedOrder && relatedOrder.status === "Pending") {
      updateOrderStatus(relatedOrder.id, "Processing");
    }
  }

  return updatedInvoice;
}