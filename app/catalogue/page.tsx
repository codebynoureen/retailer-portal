"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import Link from "next/link";

interface CatalogueProduct {
  id: string;
  name: string;
  unit: string;
  pricePaisa: number;
  stock: number;
  inStock: boolean;
}

interface CartLine {
  id: string;
  name: string;
  price: number; // rupees, matches what ProductCard/Orders page expect
  quantity: number;
}

export default function CataloguePage() {
  const [products, setProducts] = useState<CatalogueProduct[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [availableCreditLabel, setAvailableCreditLabel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/retailer/catalogue")
      .then((res) => res.json())
      .then((json) => {
        if (json.error) {
          setError(json.message);
        } else {
          setProducts(json.data.products);
        }
      })
      .catch(() => setError("Failed to load catalogue"))
      .finally(() => setLoading(false));

    fetch("/api/retailer/outstanding")
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) setAvailableCreditLabel(json.data.availableCreditLabel);
      })
      .catch(() => {
        // non-critical — banner just won't show a live figure
      });
  }, []);

  function increaseQty(id: string) {
    setQuantities((prev) => ({ ...prev, [id]: (prev[id] ?? 0) + 1 }));
  }

  function decreaseQty(id: string) {
    setQuantities((prev) => ({ ...prev, [id]: Math.max((prev[id] ?? 0) - 1, 0) }));
  }

  const cartLines: CartLine[] = products
    .filter((p) => (quantities[p.id] ?? 0) > 0)
    .map((p) => ({
      id: p.id,
      name: p.name,
      price: p.pricePaisa / 100,
      quantity: quantities[p.id],
    }));

  const totalItems = cartLines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = cartLines.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function handleViewCart() {
    localStorage.setItem("cart", JSON.stringify(cartLines));
  }

  if (loading) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-white flex flex-col shadow-lg w-full">
        <Header title="Place Order" subtitle="Browse products at your tier pricing" />
        <main className="flex-1 flex items-center justify-center text-text-muted">Loading…</main>
        <Footer />
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-sm mx-auto min-h-screen bg-white flex flex-col shadow-lg w-full">
        <Header title="Place Order" subtitle="Browse products at your tier pricing" />
        <main className="flex-1 flex items-center justify-center text-danger">{error}</main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-white flex flex-col shadow-lg w-full">
      <Header title="Place Order" subtitle="Browse products at your tier pricing" />

      <main className="flex-1 p-4 pb-40">
        <div className="bg-info-subtle border border-info/20 rounded-xl p-4 mb-4">
          <p className="text-sm text-info">
            {availableCreditLabel
              ? `Only ${availableCreditLabel} credit available — large orders may need partial payment.`
              : "Large orders may need partial payment depending on your available credit."}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-xl px-4">
          {products.length === 0 ? (
            <p className="text-center text-text-muted py-8 text-sm">No products available.</p>
          ) : (
            products.map((product) => (
              <ProductCard
                key={product.id}
                name={product.name}
                price={product.pricePaisa / 100}
                stock={product.stock}
                quantity={quantities[product.id] ?? 0}
                onIncrease={() => increaseQty(product.id)}
                onDecrease={() => decreaseQty(product.id)}
              />
            ))
          )}
        </div>
      </main>

      {totalItems > 0 && (
        <div className="fixed bottom-16 left-1/2 -translate-x-1/2 w-full max-w-sm bg-surface border-t border-border p-2 shadow-[0_-4px_16px_rgba(15,23,42,0.08)] z-40">
          <div className="flex justify-between mb-2 text-sm">
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