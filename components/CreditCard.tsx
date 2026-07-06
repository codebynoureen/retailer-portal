type CreditCardProps = {
  totalOutstanding: number;
};

export default function CreditCard({ totalOutstanding }: CreditCardProps) {
  const limit = 1000000;
  const available = Math.max(limit - totalOutstanding, 0);
  const percentage = Math.min((totalOutstanding / limit) * 100, 100);
  const barColor = percentage >= 90 ? "bg-danger" : percentage >= 70 ? "bg-warning" : "bg-dist";

  return (
    <div className="bg-secondary text-white rounded-xl p-5 mb-4">
      <p className="text-xs uppercase tracking-wide text-secondary-text font-semibold">
        Total Outstanding
      </p>

      <h2 className="text-3xl font-bold font-display mt-1">
        PKR {totalOutstanding.toLocaleString("en-IN")}
      </h2>

      <div className="mt-4">
        <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between mt-3 text-xs text-secondary-text">
        <p>
          Credit Limit: <strong className="text-white">PKR {limit.toLocaleString("en-IN")}</strong>
        </p>
        <p>
          Available: <strong className="text-white">PKR {available.toLocaleString("en-IN")}</strong>
        </p>
      </div>
    </div>
  );
}