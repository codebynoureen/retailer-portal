"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import DownloadButton from "@/components/DownloadButton";
import staticInvoices, { type Invoice } from "@/data/invoices";
import { getExtraInvoices } from "@/lib/localData";

export default function InvoiceDetails() {
  const params = useParams<{ id: string }>();
  const id = params.id as string;

  const [invoices, setInvoices] = useState<Invoice[]>(staticInvoices);

  useEffect(() => {
    setInvoices([...getExtraInvoices(), ...staticInvoices]);
  }, []);

  const invoice = invoices.find((item) => item.id === id);

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

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white shadow-lg">
      <Header title="Invoice Details" subtitle={id} />
      <main className="p-6 space-y-4">
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
          invoice.payments.map((payment) => (
            <div key={payment.date} className="flex justify-between border-b py-2">
              <div>
                <p>{payment.method}</p>
                <p className="text-sm text-gray-500">{payment.date}</p>
              </div>
              <span>{payment.amount}</span>
            </div>
          ))
        )}

        <DownloadButton />
      </main>
      <Footer />
    </div>
  );
}