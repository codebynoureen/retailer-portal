"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";
export default function OrdersPage() {
  const [cart, setCart] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

const totalItems = cart.reduce(
  (sum, item) => sum + item.quantity,
  0
);

const totalAmount = cart.reduce(
  (sum, item) => sum + item.quantity * item.price,
  0
);
const handlePlaceOrder = () => {
  alert("Order placed successfully!");

  localStorage.removeItem("cart");

  router.push("/outstanding");
};
  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white shadow-lg flex flex-col">

      <Header
        title="Your Order"
        subtitle="Review your selected items"
      />

      <main className="flex-1 p-4">

        <h2 className="font-bold mb-4">
          Cart Items
        </h2>
{cart.length === 0 ? (
  <div className="text-center py-10">
    <p className="text-gray-500">No items in cart.</p>
  </div>
) : (
  <>
    {cart.map((item) => (
      <div
        key={item.id}
        className="bg-white rounded-xl border p-4 mb-3"
      >
        <p className="font-semibold">{item.name}</p>

        <p className="text-sm text-gray-500 mt-1">
          PKR {item.price.toLocaleString()} / carton
        </p>

        <div className="flex justify-between mt-3">
          <span>Qty: {item.quantity}</span>

          <span className="font-semibold">
            PKR {(item.price * item.quantity).toLocaleString()}
          </span>
        </div>
      </div>
    ))}
  </>
)}
       {cart.map((item) => (
  <div
    key={item.id}
    className="bg-white rounded-xl border p-4 mb-3"
  >
    <p className="font-semibold">{item.name}</p>

    <p className="text-sm text-gray-500 mt-1">
      PKR {item.price.toLocaleString()} / carton
    </p>

    <div className="flex justify-between mt-3">
      <span>Qty: {item.quantity}</span>

      <span className="font-semibold">
        PKR {(item.price * item.quantity).toLocaleString()}
      </span>
    </div>
  </div>
))}
<div className="border-t p-4 bg-gray-50">
  <div className="flex justify-between mb-2">
    <span>Total Cartons</span>
    <span>{totalItems}</span>
  </div>

  <div className="flex justify-between font-bold text-lg">
    <span>Total</span>
    <span>PKR {totalAmount.toLocaleString()}</span>
  </div>

  <button
  onClick={handlePlaceOrder}
  className="w-full mt-4 bg-cyan-600 text-white py-3 rounded-lg font-semibold"
>
  Place Order
</button>
</div>
      </main>

      <Footer />

    </div>
  );
}