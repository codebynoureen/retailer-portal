import Link from "next/link";

type InvoiceCardProps = {
  invoiceNo: string;
  date: string;
  amount: string;
  status: string;
};

export default function InvoiceCard({
  invoiceNo,
  date,
  amount,
  status,
}: InvoiceCardProps) {
  const statusColor =
    status === "Paid"
      ? "bg-success-subtle text-success"
      : status === "Partial"
      ? "bg-warning-subtle text-warning"
      : status === "Pending"
      ? "bg-info-subtle text-info"
      : "bg-danger-subtle text-danger";

  return (
    <Link href={`/invoices/${invoiceNo}`}>
      <div className="bg-surface border border-border rounded-xl p-4 cursor-pointer active:bg-surface-2 transition">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-semibold text-sm text-text">{invoiceNo}</h3>
            <p className="text-xs text-text-muted mt-0.5">{date}</p>
          </div>

          <div className="text-right">
            <p className="font-bold font-mono-num text-sm text-text">
              {amount}
            </p>
            <span
              className={`text-[10px] font-bold px-2 py-1 rounded-full inline-block mt-1 ${statusColor}`}
            >
              {status}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}