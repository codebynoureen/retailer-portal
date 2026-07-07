type CreditCardProps = {
  totalOutstandingLabel: string;
  creditLimitLabel: string;
  availableCreditLabel: string;
  percentUsed: number;
};

export default function CreditCard({
  totalOutstandingLabel,
  creditLimitLabel,
  availableCreditLabel,
  percentUsed,
}: CreditCardProps) {

  const barColor =
    percentUsed >= 90
      ? "bg-danger"
      : percentUsed >= 70
      ? "bg-warning"
      : "bg-dist";

  return (
    <div className="bg-secondary text-white rounded-xl p-5 mb-4">
      <p className="text-xs uppercase tracking-wide text-secondary-text font-semibold">
        Total Outstanding
      </p>

      <h2 className="text-3xl font-bold font-display mt-1">
        {totalOutstandingLabel}
      </h2>

      <div className="mt-4">
        <div className="w-full h-2.5 bg-white/15 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${barColor}`}
            style={{ width: `${percentUsed}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between mt-3 text-xs text-secondary-text">
        <p>
          Credit Limit:{" "}
          <strong className="text-white">
            {creditLimitLabel}
          </strong>
        </p>

        <p>
          Available:{" "}
          <strong className="text-white">
            {availableCreditLabel}
          </strong>
        </p>
      </div>
    </div>
  );
}