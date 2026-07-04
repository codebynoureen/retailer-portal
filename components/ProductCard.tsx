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
    <div className="flex items-center justify-between py-4 border-b border-border last:border-b-0">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-lg bg-surface-2 flex items-center justify-center text-lg">
          📦
        </div>

        <div>
          <h3 className="text-sm font-semibold text-text">{name}</h3>
          <p
            className={`text-xs ${
              stock <= 10 ? "text-danger" : "text-success"
            }`}
          >
            {stock <= 10 ? `Only ${stock} ctns left` : "In stock"}
          </p>
          <p className="text-xs text-text-muted font-mono-num">
            PKR {price.toLocaleString("en-IN")} / ctn
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onDecrease}
          className="w-8 h-8 rounded border border-border-strong text-dist font-bold active:bg-dist-subtle"
        >
          −
        </button>
        <span className="w-6 text-center font-semibold font-mono-num">
          {quantity}
        </span>
        <button
          onClick={onIncrease}
          className="w-8 h-8 rounded border border-border-strong text-dist font-bold active:bg-dist-subtle"
        >
          +
        </button>
      </div>
    </div>
  );
}