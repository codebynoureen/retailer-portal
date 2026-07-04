"use client";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import InvoiceCard from "@/components/InvoiceCard";
import Button from "@/components/Button";
import invoices from "@/data/invoices";
import { useState } from "react";

const filters = ["All", "Paid", "Partial", "Overdue"] as const;

export default function InvoicesPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [visibleCount, setVisibleCount] = useState(2);

  const filteredInvoices = invoices.filter((invoice) => {
    const query = search.toLowerCase();
    const matchesSearch =
      invoice.id.toLowerCase().includes(query) ||
      invoice.status.toLowerCase().includes(query) ||
      invoice.amount.toLowerCase().includes(query);
    const matchesFilter = filter === "All" || invoice.status === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-bg flex flex-col">
      <Header title="My Invoices" subtitle="View and download all invoices" />

      <main className="flex-1 p-4 pb-24">
        <input
          type="text"
          placeholder="Search invoice by ID, status, or amount"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full h-12 border border-border bg-surface-2 rounded-lg px-3 mb-4 text-sm outline-none focus:border-dist focus:bg-surface"
        />

        <div className="flex gap-2 mb-4">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                filter === f
                  ? "bg-dist text-white"
                  : "bg-surface-2 text-text-dim"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="space-y-3">
          {filteredInvoices.length > 0 ? (
            filteredInvoices.slice(0, visibleCount).map((invoice) => (
              <InvoiceCard
                key={invoice.id}
                invoiceNo={invoice.id}
                date={invoice.dueDate}
                amount={invoice.amount}
                status={invoice.status}
              />
            ))
          ) : (
            <div className="text-center py-10">
              <p className="text-base font-semibold text-text">
                No invoices found
              </p>
              <p className="text-text-muted text-sm mt-1">
                Try another search or filter.
              </p>
            </div>
          )}
        </div>

        {visibleCount < filteredInvoices.length && (
          <div className="mt-4">
            <Button
              title="Load More"
              variant="secondary"
              onClick={() => setVisibleCount(visibleCount + 2)}
            />
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}