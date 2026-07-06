import staticInvoices, { type Invoice } from "@/data/invoices";
import type { PastOrder } from "@/data/orders";

const INVOICES_KEY = "extraInvoices";
const ORDERS_KEY = "extraOrders";
const OVERRIDES_KEY = "invoiceOverrides";

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
   PAYMENT STATUS — invoice overrides
   Static invoices (data/invoices.ts) can't be edited at runtime,
   and extra invoices (from placed orders) are only ever appended.
   So when a payment is made, we don't rewrite those records —
   we store a small "override" per invoice id (new status, new
   remaining amount, updated payments list) and merge it on top
   whenever invoices are read. This is what makes a payment
   persist and show up correctly on every screen after reload.
───────────────────────────────────────────────────────── */

type InvoiceOverride = Pick<Invoice, "status" | "amount" | "payments">;

function getInvoiceOverrides(): Record<string, InvoiceOverride> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(OVERRIDES_KEY);
    return raw ? (JSON.parse(raw) as Record<string, InvoiceOverride>) : {};
  } catch {
    return {};
  }
}

function setInvoiceOverride(id: string, override: InvoiceOverride) {
  const current = getInvoiceOverrides();
  current[id] = override;
  localStorage.setItem(OVERRIDES_KEY, JSON.stringify(current));
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

/**
 * Static invoices + extra (order-placed) invoices + any payment
 * overrides applied on top. Every screen should read invoices
 * through this function so payment status always stays correct.
 */
export function getMergedInvoices(): Invoice[] {
  const base = [...getExtraInvoices(), ...staticInvoices];
  const overrides = getInvoiceOverrides();

  return base.map((invoice) =>
    overrides[invoice.id] ? { ...invoice, ...overrides[invoice.id] } : invoice
  );
}

/**
 * Records a payment against an invoice and updates its status:
 * - remaining balance <= 0  -> "Paid"
 * - otherwise               -> "Partial"
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

  return updatedInvoice;
}