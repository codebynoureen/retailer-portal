import type { Invoice } from "@/data/invoices";
import type { PastOrder } from "@/data/orders";

const INVOICES_KEY = "extraInvoices";
const ORDERS_KEY = "extraOrders";

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