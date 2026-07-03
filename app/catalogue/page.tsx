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
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
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

  const totalItems = products.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalAmount = products.reduce(
    (sum, item) => sum + item.quantity * item.price,
    0
  );
  const handleViewCart = () => {
  const selectedProducts = products.filter(
    (item) => item.quantity > 0
  );

  localStorage.setItem(
    "cart",
    JSON.stringify(selectedProducts)
  );
};

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white shadow-lg flex flex-col">

      {/* Header */}
      <Header
        title="Place Order"
        subtitle="Browse products at your tier pricing"
      />

      {/* Main Content */}
      <main className="flex-1 p-4 pb-2">

        {/* Credit Warning */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
          <p className="text-sm text-blue-700">
            Only PKR 15,500 credit available — large orders may need partial payment.
          </p>
        </div>

        {/* Products */}
        <div className="bg-white rounded-xl shadow-sm p-4">
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

      {/* Sticky Bottom Bar */}
      <div className="w-full bg-white rounded-xl border p-4 mt-6 shadow-sm">

        <div className="flex justify-between mb-3 text-sm">
          <span>{totalItems} cartons</span>
          <span className="font-bold">
            PKR {totalAmount.toLocaleString()}
          </span>
        </div>

      <Link href="/orders" onClick={handleViewCart}>
  <button className="w-full bg-cyan-600 text-white py-3 rounded-lg font-semibold">
    View Cart & Place Order
  </button>
</Link>

      </div>

      {/* Footer */}
      <Footer />

    </div>
  );
}