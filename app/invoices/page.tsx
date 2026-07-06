"use client";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import InvoiceCard from "@/components/InvoiceCard";
import Button from "@/components/Button";
import { type Invoice } from "@/data/invoices";
import { getMergedInvoices } from "@/lib/localData";
import { useEffect, useState } from "react";

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(2);

  useEffect(() => {
    const refresh = () => setInvoices(getMergedInvoices());
    refresh();
    window.addEventListener("invoices-updated", refresh);
    return () => window.removeEventListener("invoices-updated", refresh);
  }, []);

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
    <div className="max-w-sm mx-auto min-h-screen bg-white shadow-lg">
      <Header title="My Invoices" subtitle="View and download all invoices" />
      <main className="p-6 pb-20 space-y-4">
        <input
          type="text"
          placeholder="Search invoice by ID, status, or amount"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border rounded-lg p-3 mb-4"
        />

        <div className="flex gap-2 mb-4 flex-wrap">
          {["All", "Pending", "Paid", "Partial", "Overdue"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-2 rounded-lg ${
                filter === s ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <h2 className="text-2xl font-bold mb-1">My Invoices</h2>
        <p className="text-gray-500 mb-6">View and download all invoices</p>

        <div className="space-y-4">
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
              <p className="text-lg font-semibold">No invoices found</p>
              <p className="text-gray-500">Try another search or filter.</p>
            </div>
          )}
        </div>

        {visibleCount < filteredInvoices.length && (
          <Button title="Load More" onClick={() => setVisibleCount(visibleCount + 2)} />
        )}
      </main>
      <Footer />
    </div>
  );
}