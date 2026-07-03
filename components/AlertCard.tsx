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
    <div className="bg-red-100 border border-red-300 rounded-xl p-4">
      <h3 className="text-red-700 font-semibold">
        Invoice {invoiceNo} is overdue
      </h3>

<p className="text-red-600 text-sm mt-1">
  {amount} {status === "Partial" ? "partially due" : "due"} •{" "}
  {overdueDays} days overdue
</p>
    </div>
  );
}