import Header from "../../components/Header";
import Footer from "../../components/Footer";
import CreditCard from "../../components/CreditCard";
import KpiCard from "@/components/KpiCard";
import AlertCard from "@/components/AlertCard";
import InvoiceCard from "@/components/InvoiceCard";
import Button from "@/components/Button";
import invoices from "@/data/invoices";
import Link from "next/link";
export default function Home() {

const today = new Date();

const overdueInvoices = invoices.filter(
  (invoice) => invoice.status === "Overdue"
);

const paidInvoices = invoices.filter(
  (invoice) => invoice.status === "Paid"
);

const partialInvoices = invoices.filter(
  (invoice) => invoice.status === "Partial"
);
const oldest = [...overdueInvoices].sort(
  (a, b) =>
    new Date(a.dueDate).getTime() -
    new Date(b.dueDate).getTime()
)[0];
const overdueDays = oldest
  ? Math.floor(
      (today.getTime() - new Date(oldest.dueDate).getTime()) /
      (1000 * 60 * 60 * 24)
    )
  : 0;
 const outstandingInvoices = invoices.filter(
  (invoice) =>
    invoice.status === "Overdue" ||
    invoice.status === "Partial"
);

const totalOutstanding = outstandingInvoices.reduce(
  (total, invoice) =>
    total + Number(invoice.amount.replace(/[^0-9]/g, "")),
  0
);
  return (
    <div  className="max-w-sm mx-auto min-h-screen bg-white shadow-lg" >
      <Header
  title="Al-Noor General Store"
  subtitle="Model Town, Lahore"
/>

      <main className="p-6">
      <CreditCard
  totalOutstanding={totalOutstanding}
/>
        <div className="grid grid-cols-2 gap-4">
  <KpiCard
    value={overdueInvoices.length.toString()}
    label="Overdue Invoice"
    color="text-red-600"
  />
<KpiCard
  value={paidInvoices.length.toString()}
  label="Paid Invoices"
  color="text-green-600"
/>
  <KpiCard
  value={overdueDays.toString()}
  label="Days Oldest Due"
/>
<KpiCard
  value={partialInvoices.length.toString()}
  label="Partial Invoices"
  color="text-yellow-600"
/>

</div>
{oldest && (
 <AlertCard
  invoiceNo={oldest.id}
  amount={oldest.amount}
  overdueDays={overdueDays}
  status={oldest.status}
/>
)}
<h2 className="text-xl font-bold mt-6">
  Outstanding Invoices
</h2>
<div className="space-y-4">
  {outstandingInvoices.map((invoice) => (
    <InvoiceCard
      key={invoice.id}
      invoiceNo={invoice.id}
      date={invoice.dueDate}
      amount={invoice.amount}
      status={invoice.status}
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
