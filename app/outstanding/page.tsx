"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CreditCard from "../../components/CreditCard";
import KpiCard from "@/components/KpiCard";
import AlertCard from "@/components/AlertCard";
import InvoiceCard from "@/components/InvoiceCard";
import Button from "@/components/Button";

interface OutstandingInvoice {
  id: string;
  invoiceNo: string;
  amountPaisa: number;
  amountLabel: string;
  status: "OVERDUE" | "PARTIAL" | "PENDING";
  dueDate: string;
  daysOverdue: number;
}

interface OutstandingResponse {
  outletName: string;
  outletAddress: string;
  totalOutstandingLabel: string;
  creditLimitLabel: string;
  availableCreditLabel: string;
  percentUsed: number;
  overdueCount: number;
  oldestOverdueDays: number;
  invoices: OutstandingInvoice[];
}

export default function OutstandingPage() {
  const [data, setData] = useState<OutstandingResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/retailer/outstanding")
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.message);
        } else {
          setData(json.data);
        }
      })
      .catch(() => setError("Failed to load outstanding balance"))
      .finally(() => setLoading(false));
  }, []);

  async function handlePay(invoiceId: string, remainingPaisa: number) {
    const remainingRupees = Math.round(remainingPaisa / 100);

    const input = prompt(
      `Enter amount to pay for ${invoiceId} (PKR).\nRemaining balance: PKR ${remainingRupees.toLocaleString()}`,
      remainingRupees.toString()
    );

    if (input === null) return; // user cancelled

    const enteredRupees = Number(input);

    if (!Number.isFinite(enteredRupees) || enteredRupees <= 0) {
      alert("Please enter a valid positive amount.");
      return;
    }

    const amountPaisa = Math.round(enteredRupees * 100);

    if (amountPaisa > remainingPaisa) {
      alert(`Amount exceeds the remaining balance of PKR ${remainingRupees.toLocaleString()}.`);
      return;
    }

    const methodChoice = prompt(
      "Payment method — type one of: CASH, BANK_TRANSFER, JAZZCASH, EASYPAISA",
      "CASH"
    );
    const validMethods = ["CASH", "BANK_TRANSFER", "JAZZCASH", "EASYPAISA"];
    const method = methodChoice?.toUpperCase().trim();

    if (!method || !validMethods.includes(method)) {
      alert("Invalid payment method.");
      return;
    }

    try {
      const res = await fetch(`/api/invoices/${invoiceId}/pay`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amountPaisa, method }),
      });
      const json = await res.json();

      if (json.error) {
        alert(json.message);
        return;
      }

      alert(
        `Payment of PKR ${enteredRupees.toLocaleString()} recorded. New status: ${json.data.status}. Remaining: ${json.data.remainingLabel}`
      );
      window.location.reload();
    } catch {
      alert("Payment failed. Please try again.");
    }
  }

  if (loading) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-bg flex flex-col shadow-lg">
        <Header title="Retailer Portal" subtitle="Loading…" />
        <main className="p-4   pb-20 text-center text-text-muted">Loading…</main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-bg flex flex-col shadow-lg">
        <Header title="Retailer Portal" />
        <main className="p-4 pb-20 text-center text-danger">{error ?? "No data"}</main>
        <Footer />
      </div>
    );
  }

  const oldest = data.invoices.find((inv) => inv.status === "OVERDUE");

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white shadow-lg">
      <Header title={data.outletName} subtitle={data.outletAddress} />

      <main className="p-4 pb-20 space-y-6">
        <CreditCard
          totalOutstandingLabel={data.totalOutstandingLabel}
          creditLimitLabel={data.creditLimitLabel}
          availableCreditLabel={data.availableCreditLabel}
          percentUsed={data.percentUsed}
        />

        <div className="grid grid-cols-2 gap-4 mt-4">
          <KpiCard value={data.overdueCount.toString()} label="Overdue Invoice" color="text-danger" />
          <KpiCard value={data.oldestOverdueDays.toString()} label="Days Oldest Due" />
        </div>

        {oldest && (
          <AlertCard
            invoiceNo={oldest.invoiceNo}
            amount={oldest.amountLabel}
            overdueDays={oldest.daysOverdue}
            status="Overdue"
          />
        )}

        <h2 className="text-xl font-bold font-display text-text mt-6">Outstanding Invoices</h2>
        <div className="space-y-4">
          {data.invoices.map((invoice) => (
            <InvoiceCard
              key={invoice.id}
              invoiceNo={invoice.invoiceNo}
              date={invoice.dueDate}
              amount={invoice.amountLabel}
              status={
                invoice.status === "OVERDUE"
                  ? "Overdue"
                  : invoice.status === "PARTIAL"
                  ? "Partial"
                  : "Pending"
              }
              onPay={() => handlePay(invoice.id, invoice.amountPaisa)}
            />
          ))}
        </div>

        <Link href="/invoices">
          <Button title="View All Invoices" />
        </Link>
      </main>

      <Footer />
    </div>
  );
}