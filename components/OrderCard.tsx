import { useRouter } from "next/navigation";
interface OrderCardProps {
  name: string;
  quantity: number;
  price: number;
}

export default function OrderCard({
  name,
  quantity,
  price,
}: OrderCardProps) {
    const router = useRouter();
  return (
    <div className="border-b py-4">
      <h3 className="font-semibold">{name}</h3>

      <div className="flex justify-between mt-2 text-sm text-gray-600">
        <span>{quantity} cartons</span>

        <span className="font-semibold text-black">
          PKR {price.toLocaleString()}
        </span>
      </div>
    </div>
  );
}