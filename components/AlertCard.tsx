type AlertCardProps = {
  invoiceNo: string;
  amount: string;
  overdueDays: number;
  status: string;
};

export default function AlertCard({
  invoiceNo,
  amount,
  overdueDays,
  status,
}: AlertCardProps) {
  return (
    <div className="bg-danger-subtle border border-danger/20 rounded-xl p-4 mt-4">
      <h3 className="text-danger font-semibold text-sm">
        Invoice {invoiceNo} is overdue
      </h3>
      <p className="text-danger text-sm mt-1 opacity-90">
        {amount} {status === "Partial" ? "partially due" : "due"} •{" "}
        {overdueDays} days overdue
      </p>
    </div>
  );
}