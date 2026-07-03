type ProductCardProps = {
  name: string;
  price: number;
  stock: number;
  quantity: number;
  onIncrease?: () => void;
  onDecrease?: () => void;
};

export default function ProductCard({
  name,
  price,
  stock,
  quantity,
  onIncrease,
  onDecrease,
}: ProductCardProps) {
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-200">
      {/* Product Info */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-gray-100 flex items-center justify-center">
          📦
        </div>

        <div>
          <h3 className="text-sm font-semibold">{name}</h3>

          <p
            className={`text-xs ${
              stock <= 10 ? "text-red-600" : "text-green-600"
            }`}
          >
            {stock <= 10 ? `Only ${stock} ctns left` : "In stock"}
          </p>

          <p className="text-xs text-gray-500">
            PKR {price.toLocaleString()} / ctn
          </p>
        </div>
      </div>

      {/* Quantity Stepper */}
      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          className="w-8 h-8 rounded border border-gray-300 font-bold"
        >
          −
        </button>

        <span className="w-6 text-center font-semibold">
          {quantity}
        </span>

        <button
          onClick={onIncrease}
          className="w-8 h-8 rounded border border-gray-300 font-bold"
        >
          +
        </button>
      </div>
    </div>
  );
}