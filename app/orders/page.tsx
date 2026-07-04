"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import OrderCard from "@/components/OrderCard";
import staticOrders, { type PastOrder } from "@/data/orders";
import type { Invoice } from "@/data/invoices";
import { addExtraInvoice, addExtraOrder, getExtraOrders } from "@/lib/localData";

export default function OrdersPage() {
  const [cart, setCart] = useState<any[]>([]);
  const [orderHistory, setOrderHistory] = useState<PastOrder[]>(staticOrders);
  const router = useRouter();

  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
    setOrderHistory([...getExtraOrders(), ...staticOrders]);
  }, []);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cart.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handlePlaceOrder = () => {
    if (cart.length === 0) return;

    const orderId = `ORD-2026-${Math.floor(1000 + Math.random() * 9000)}`;
    const invoiceId = `INV-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const today = new Date();
    const dueDate = new Date(today);
    dueDate.setDate(dueDate.getDate() + 15);

    const formattedToday = today.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const newOrder: PastOrder = {
      id: orderId,
      date: formattedToday,
      status: "Pending",
      items: cart.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    const newInvoice: Invoice = {
      id: invoiceId,
      amount: `PKR ${totalAmount.toLocaleString()}`,
      status: "Pending",
      dueDate: dueDate.toISOString().split("T")[0],
      items: cart.map((item) => ({
        name: item.name,
        price: `PKR ${(item.price * item.quantity).toLocaleString()}`,
      })),
      payments: [],
    };

    addExtraOrder(newOrder);
    addExtraInvoice(newInvoice);

    alert("Order placed successfully! A new invoice has been generated.");
    localStorage.removeItem("cart");
    router.push("/outstanding");
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white shadow-lg flex flex-col">
      <Header title="Your Order" subtitle="Review your selected items" />

      <main className="flex-1 p-4">
        <h2 className="font-bold mb-4">Cart Items</h2>

        {cart.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No items in cart.</p>
          </div>
        ) : (
          <>
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-xl border p-4 mb-3">
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

            <div className="border-t p-4 bg-gray-50 rounded-xl">
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
          </>
        )}

        <h2 className="font-bold mt-8 mb-4">Order History</h2>
        {orderHistory.map((order) => (
          <OrderCard
            key={order.id}
            orderId={order.id}
            date={order.date}
            status={order.status}
            items={order.items}
          />
        ))}
      </main>

      <Footer />
    </div>
  );
}