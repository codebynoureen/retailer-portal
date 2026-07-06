type OrderItem = {
  name: string;
  quantity: number;
  price: number;
};

type OrderCardProps = {
  orderId: string;
  date: string;
  status: "Delivered" | "Pending" | "Processing";
  items: OrderItem[];
  onMarkDelivered?: (orderId: string) => void;
};

export default function OrderCard({
  orderId,
  date,
  status,
  items,
  onMarkDelivered,
}: OrderCardProps) {
  const total = items.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const statusColor =
    status === "Delivered"
      ? "bg-green-100 text-green-700"
      : status === "Processing"
      ? "bg-yellow-100 text-yellow-700"
      : "bg-blue-100 text-blue-700";

  return (
    <div className="bg-white border rounded-xl p-4 mb-3">
      <div className="flex justify-between items-center mb-2">
        <div>
          <h3 className="font-semibold">{orderId}</h3>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
          {status}
        </span>
      </div>

      {items.map((item) => (
        <div
          key={item.name}
          className="flex justify-between text-sm text-gray-600 py-1"
        >
          <span>
            {item.name} × {item.quantity}
          </span>
          <span>PKR {(item.price * item.quantity).toLocaleString()}</span>
        </div>
      ))}

      <div className="flex justify-between mt-2 pt-2 border-t font-semibold">
        <span>Total</span>
        <span>PKR {total.toLocaleString()}</span>
      </div>

      {status === "Processing" && onMarkDelivered && (
        <button
          onClick={() => onMarkDelivered(orderId)}
          className="w-full mt-3 bg-green-600 text-white py-2 rounded-lg text-sm font-semibold"
        >
          Mark as Delivered
        </button>
      )}
    </div>
  );
}