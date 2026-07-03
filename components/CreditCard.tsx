type CreditCardProps = {
  totalOutstanding: number;
};

export default function CreditCard({
  totalOutstanding,
}: CreditCardProps) {
  const limit = 500000;

  const available = limit - totalOutstanding;

  const percentage = (totalOutstanding / limit) * 100;

  return (
    <div className="bg-blue-900 text-white rounded-xl p-5">
      <p className="text-sm text-gray-300">
        Total Outstanding
      </p>

      <h2 className="text-3xl font-bold mt-2">
        PKR {totalOutstanding.toLocaleString()}
      </h2>

      <div className="mt-4">
        <div className="w-full h-2 bg-blue-700 rounded-full">
          <div
            className="h-2 bg-red-500 rounded-full"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>

      <div className="flex justify-between mt-4 text-sm">
        <p>Limit: PKR {limit.toLocaleString()}</p>

        <p>
          Available: PKR {available.toLocaleString()}
        </p>
      </div>
    </div>
  );
}