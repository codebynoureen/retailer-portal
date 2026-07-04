import Link from "next/link";

type InvoiceCardProps = {
  invoiceNo: string;
  date: string;
  amount: string;
  status: string;
};

export default function InvoiceCard({ invoiceNo, date, amount, status }: InvoiceCardProps) {
  const statusColor =
    status === "Paid"
      ? "bg-green-100 text-green-700"
      : status === "Partial"
      ? "bg-yellow-100 text-yellow-700"
      : status === "Pending"
      ? "bg-blue-100 text-blue-700"
      : "bg-red-100 text-red-700";

  return (
    <Link href={`/invoices/${invoiceNo}`}>
      <div className="bg-white border rounded-xl p-4 cursor-pointer hover:shadow-md transition">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold">{invoiceNo}</h3>
            <p className="text-sm text-gray-500">{date}</p>
          </div>
          <div className="text-right">
            <p className="font-bold">{amount}</p>
            <span className={`text-sm px-2 py-1 rounded-full ${statusColor}`}>{status}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}