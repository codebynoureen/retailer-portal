"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useRouter } from "next/navigation";

type CartItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
};

export default function OrdersPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    // localStorage is only available in the browser, so the cart must be
    // hydrated after mount rather than during the initial render.
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCart(JSON.parse(storedCart));
    }
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
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
    <div className="max-w-sm mx-auto min-h-screen bg-bg flex flex-col">
      <Header title="Your Order" subtitle="Review your selected items" />

      <main className="flex-1 p-4 pb-24">
        <h2 className="font-bold font-display mb-3 text-text">Cart Items</h2>

        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-text-muted">No items in cart.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {cart.map((item) => (
              <div
                key={item.id}
                className="bg-surface rounded-xl border border-border p-4"
              >
                <p className="font-semibold text-text">{item.name}</p>
                <p className="text-sm text-text-muted mt-1 font-mono-num">
                  PKR {item.price.toLocaleString("en-IN")} / carton
                </p>
                <div className="flex justify-between mt-3 text-sm">
                  <span className="text-text-muted">Qty: {item.quantity}</span>
                  <span className="font-semibold font-mono-num text-text">
                    PKR {(item.price * item.quantity).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {cart.length > 0 && (
          <div className="border border-border rounded-xl p-4 bg-surface-2 mt-4">
            <div className="flex justify-between mb-2 text-sm">
              <span className="text-text-muted">Total Cartons</span>
              <span className="text-text">{totalItems}</span>
            </div>
            <div className="flex justify-between font-bold text-lg font-mono-num text-text">
              <span className="font-sans">Total</span>
              <span>PKR {totalAmount.toLocaleString("en-IN")}</span>
            </div>
            <button
              onClick={handlePlaceOrder}
              className="w-full h-12 mt-4 bg-dist text-white rounded-lg font-semibold active:bg-dist-hover"
            >
              Place Order
            </button>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}