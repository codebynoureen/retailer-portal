"use client";

import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import productsData from "@/data/products";
import Link from "next/link";

export default function CataloguePage() {
  const [products, setProducts] = useState(productsData);

  const increaseQty = (id: number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQty = (id: number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const totalItems = products.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );

  const handleViewCart = () => {
    const selectedProducts = products.filter((item) => item.quantity > 0);
    localStorage.setItem("cart", JSON.stringify(selectedProducts));
  };

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white shadow-lg">
      <Header
        title="Place Order"
        subtitle="Browse products at your tier pricing"
      />

      <main className="flex-1 p-4 pb-40">
        <div className="bg-info-subtle border border-info/20 rounded-xl p-4 mb-4">
          <p className="text-sm text-info">
            Only PKR 15,500 credit available — large orders may need partial
            payment.
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl px-4">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
              stock={product.stock}
              quantity={product.quantity}
              onIncrease={() => increaseQty(product.id)}
              onDecrease={() => decreaseQty(product.id)}
            />
          ))}
        </div>
      </main>

      {totalItems > 0 && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-sm bg-surface border-t border-border p-2 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] z-40">
          <div className="flex justify-between mb-2s text-sm">
            <span className="text-text-muted">{totalItems} cartons</span>
            <span className="font-bold font-mono-num text-text">
              PKR {totalAmount.toLocaleString("en-IN")}
            </span>
          </div>
          <Link href="/orders" onClick={handleViewCart}>
            <button className="w-full h-10 bg-dist text-white rounded-lg font-semibold active:bg-dist-hover">
              View Cart & Place Order
            </button>
          </Link>
        </div>
      )}

      <Footer />
    </div>
  );
}