"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderCard from "@/components/OrderCard";

interface CartLine {
  id: string;
  name: string;
  price: number; // rupees
  quantity: number;
}

interface OrderHistoryItem {
  id: string;
  orderNo: string;
  status: "PENDING" | "CONFIRMED" | "OUT_FOR_DELIVERY" | "DELIVERED" | "CANCELLED";
  totalLabel: string;
  createdAt: string;
  items: { name: string; quantity: number; pricePaisa: number }[];
}

function toOrderCardStatus(
  status: OrderHistoryItem["status"]
): "Delivered" | "Pending" | "Processing" {
  switch (status) {
    case "DELIVERED":
      return "Delivered";
    case "CONFIRMED":
    case "OUT_FOR_DELIVERY":
      return "Processing";
    case "PENDING":
    case "CANCELLED":
    default:
      return "Pending";
  }
}

export default function OrdersPage() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [orderHistory, setOrderHistory] = useState<OrderHistoryItem[]>([]);
  const [placing, setPlacing] = useState(false);
  const [placeError, setPlaceError] = useState<string | null>(null);
  const [historyLoading, setHistoryLoading] = useState(true);
  const router = useRouter();

  const loadHistory = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch("/api/retailer/orders?page=1&pageSize=20");
      const json = await res.json();
      if (!json.error) {
        setOrderHistory(json.data.orders);
      }
    } catch {
      // non-critical for this screen's primary job (placing an order)
    } finally {
      setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    loadHistory();
  }, [loadHistory]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce((sum, item) => sum + item.quantity * item.price, 0);

  async function handlePlaceOrder() {
    if (cart.length === 0) return;
    setPlacing(true);
    setPlaceError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((item) => ({ productId: item.id, quantity: item.quantity })),
        }),
      });
      const json = await res.json();

      if (json.error) {
        setPlaceError(json.message);
        setPlacing(false);
        return;
      }

      alert(`Order placed successfully — ${json.data.orderNo}`);
      localStorage.removeItem("cart");
      setCart([]);
      await loadHistory();
      router.push("/outstanding");
    } catch {
      setPlaceError("Failed to place order. Please try again.");
      setPlacing(false);
    }
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white flex flex-col shadow-lg w-full">
      <Header title="Your Order" subtitle="Review your selected items" />

      <main className="p-8 pb-20">
        <h2 className="font-bold font-display text-text mb-4">Cart Items</h2>

        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-text-muted">No items in cart.</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="bg-surface border border-border rounded-xl p-4 mb-3">
                <p className="font-semibold text-text">{item.name}</p>
                <p className="text-sm text-text-muted mt-1">
                  PKR {item.price.toLocaleString()} / carton
                </p>
                <div className="flex justify-between mt-3 text-text">
                  <span>Qty: {item.quantity}</span>
                  <span className="font-semibold">
                    PKR {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              </div>
            ))}

            <div className="border border-border p-4 bg-surface-2 rounded-xl">
              <div className="flex justify-between mb-2 text-text">
                <span>Total Cartons</span>
                <span>{totalItems}</span>
              </div>
              <div className="flex justify-between font-bold text-lg text-text">
                <span>Total</span>
                <span>PKR {totalAmount.toLocaleString()}</span>
              </div>

              {placeError && (
                <div className="mt-3 text-sm text-danger bg-danger-subtle border border-danger/20 rounded-lg px-3 py-2">
                  {placeError}
                </div>
              )}

              <button
                onClick={handlePlaceOrder}
                disabled={placing}
                className="w-full mt-4 bg-dist text-white py-3 rounded-lg font-semibold disabled:opacity-50 active:bg-dist-hover"
              >
                {placing ? "Placing Order…" : "Place Order"}
              </button>
            </div>
          </>
        )}

        <h2 className="font-bold font-display text-text mt-8 mb-4">Order History</h2>
        {historyLoading ? (
          <p className="text-center text-text-muted py-6">Loading…</p>
        ) : orderHistory.length === 0 ? (
          <p className="text-center text-text-muted py-6">No past orders yet.</p>
        ) : (
          orderHistory.map((order) => (
            <OrderCard
              key={order.id}
              orderId={order.orderNo}
              date={new Date(order.createdAt).toLocaleDateString("en-GB", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
              status={toOrderCardStatus(order.status)}
              items={order.items.map((item) => ({
                name: item.name,
                quantity: item.quantity,
                price: item.pricePaisa / 100,
              }))}
            />
          ))
        )}
      </main>

      <Footer />
    </div>
  );
}