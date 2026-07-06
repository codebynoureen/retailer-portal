"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DownloadButton from "@/components/DownloadButton";
import { type Invoice } from "@/data/invoices";
import { getMergedInvoices, payInvoice } from "@/lib/localData";

const PAYMENT_METHODS = ["JazzCash", "EasyPaisa", "Bank Transfer", "Cash"];

export default function InvoiceDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState(PAYMENT_METHODS[0]);

  useEffect(() => {
    setInvoices(getMergedInvoices());
  }, []);

  const invoice = invoices.find((item) => item.id === id);

  const handlePay = () => {
    const amountPaid = Number(amount);
    if (!amountPaid || amountPaid <= 0) return;

    payInvoice(id, amountPaid, method);

    // Re-read invoices so this page (and the amount/status shown) reflects
    // the payment immediately. Outstanding & Invoices pages pick it up too,
    // the next time they load, since they also read through getMergedInvoices().
    setInvoices(getMergedInvoices());
    setAmount("");
  };

  if (!invoice) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-white shadow-lg">
        <Header title="Invoice Details" subtitle={id} />
        <main className="p-6">
          <p className="text-gray-500">Invoice not found.</p>
        </main>
        <Footer />
      </div>
    );
  }

  const remaining = Number(invoice.amount.replace(/[^0-9]/g, ""));

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-lg pl-7 pr-7">
      <Header title="Invoice Details" subtitle={id} />
      <main className="p-6 pb-20 space-y-4">
        <div className="border rounded-xl p-4">
          <p><strong>Invoice No:</strong> {id}</p>
          <p><strong>Amount:</strong> {invoice.amount}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          <p><strong>Due Date:</strong> {invoice.dueDate}</p>
        </div>

        <h3 className="text-lg font-bold mt-6">Services</h3>
        {invoice.items.map((item) => (
          <div key={item.name} className="flex justify-between border-b py-2">
            <span>{item.name}</span>
            <span>{item.price}</span>
          </div>
        ))}

        <h3 className="text-lg font-bold mt-6">Payment History</h3>
        {invoice.payments.length === 0 ? (
          <p className="text-sm text-gray-500">No payments recorded yet.</p>
        ) : (
          invoice.payments.map((payment, index) => (
            <div key={`${payment.date}-${index}`} className="flex justify-between border-b py-2">
              <div>
                <p>{payment.method}</p>
                <p className="text-sm text-gray-500">{payment.date}</p>
              </div>
              <span>{payment.amount}</span>
            </div>
          ))
        )}

        {invoice.status !== "Paid" && (
          <div className="border rounded-xl p-4 mt-4 space-y-3">
            <h3 className="text-lg font-bold">Make a Payment</h3>
            <p className="text-sm text-gray-500">
              Remaining balance: PKR {remaining.toLocaleString("en-IN")}
            </p>

            <input
              type="number"
              placeholder="Amount to pay"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border rounded-lg p-3"
            />

            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full border rounded-lg p-3"
            >
              {PAYMENT_METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>

            <button
              onClick={handlePay}
              className="w-full h-12 bg-blue-600 text-white rounded-lg font-semibold"
            >
              Pay Now
            </button>
          </div>
        )}

        <DownloadButton />
      </main>
      <Footer />
    </div>
  );
}