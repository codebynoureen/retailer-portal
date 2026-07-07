"use client";

import { useEffect, useState, useCallback } from "react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import InvoiceCard from "@/components/InvoiceCard";
import Button from "@/components/Button";

interface InvoiceListItem {
  id: string;
  invoiceNo: string;
  totalLabel: string;
  remainingLabel: string;
  status: "PENDING" | "PARTIAL" | "PAID" | "OVERDUE";
  dueDate: string;
  createdAt: string;
}

const STATUS_OPTIONS = ["All", "PENDING", "PARTIAL", "PAID", "OVERDUE"] as const;

function displayStatus(status: InvoiceListItem["status"]) {
  switch (status) {
    case "PENDING":
      return "Pending";
    case "PARTIAL":
      return "Partial";
    case "PAID":
      return "Paid";
    case "OVERDUE":
      return "Overdue";
  }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<InvoiceListItem[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof STATUS_OPTIONS)[number]>("All");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInvoices = useCallback(
    async (targetPage: number, append: boolean) => {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.set("page", targetPage.toString());
      params.set("pageSize", "5");
      if (filter !== "All") params.set("status", filter);
      if (search.trim()) params.set("search", search.trim());

      try {
        const res = await fetch(`/api/retailer/invoices?${params.toString()}`);
        const json = await res.json();

        if (json.error) {
          setError(json.message);
          return;
        }

        setInvoices((prev) => (append ? [...prev, ...json.data.invoices] : json.data.invoices));
        setTotalPages(json.data.pagination.totalPages);
        setPage(targetPage);
      } catch {
        setError("Failed to load invoices");
      } finally {
        setLoading(false);
      }
    },
    [filter, search]
  );

  useEffect(() => {
    loadInvoices(1, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, search]);

  async function handleDownloadPdf(invoiceId: string) {
    const res = await fetch(`/api/invoices/${invoiceId}/pdf`);

    if (!res.ok) {
      let message = `Failed to open invoice PDF (status ${res.status})`;
      try {
        const json = await res.json();
        if (json?.message) message = json.message;
      } catch {
        // response wasn't JSON — keep the generic message
      }
      alert(message);
      console.error("PDF open failed:", message);
      return;
    }

    const blob = await res.blob();
    const url = window.URL.createObjectURL(blob);
    window.open(url, "_blank");
    setTimeout(() => window.URL.revokeObjectURL(url), 30000);
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white shadow-lg">
      <Header title="My Invoices" subtitle="View and download all invoices" />
      <main className="p-4 pb-20 space-y-4">
        <input
          type="text"
          placeholder="Search invoice by ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 px-3 border border-border rounded-lg bg-surface-2 text-sm text-text focus:border-dist focus:outline-none focus:ring-2 focus:ring-dist/20"
        />

        <div className="flex gap-2 flex-wrap">
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold ${
                filter === s ? "bg-dist text-white" : "bg-surface-2 text-text-muted"
              }`}
            >
              {s === "All" ? "All" : displayStatus(s as InvoiceListItem["status"])}
            </button>
          ))}
        </div>

        {error && <div className="text-center py-6 text-danger">{error}</div>}

        <div className="space-y-4">
          {!loading && invoices.length === 0 && !error ? (
            <div className="text-center py-10">
              <p className="text-lg font-semibold text-text">No invoices found</p>
              <p className="text-text-muted">Try another search or filter.</p>
            </div>
          ) : (
            invoices.map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoiceNo={invoice.invoiceNo}
                date={invoice.dueDate}
                amount={invoice.status === "PAID" ? invoice.totalLabel : invoice.remainingLabel}
                status={displayStatus(invoice.status)}
                onDownload={() => handleDownloadPdf(invoice.id)}
              />
            ))
          )}
        </div>

        {loading && <div className="text-center py-4 text-text-muted">Loading…</div>}

        {!loading && page < totalPages && (
          <Button title="Load More" onClick={() => loadInvoices(page + 1, true)} />
        )}
      </main>
      <Footer />
    </div>
  );
}