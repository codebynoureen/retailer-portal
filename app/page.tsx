"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Wallet, FileText, ShoppingCart, Package } from "lucide-react";

interface Profile {
  outletName: string;
  outletAddress: string;
  userName: string;
}

const quickLinks = [
  { href: "/outstanding", label: "Outstanding Balance", icon: Wallet, desc: "Check what you owe" },
  { href: "/invoices", label: "Invoices", icon: FileText, desc: "View & download invoices" },
  { href: "/catalogue", label: "Place Order", icon: ShoppingCart, desc: "Browse products" },
  { href: "/orders", label: "My Orders", icon: Package, desc: "Track order history" },
];

export default function Home() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/retailer/profile")
      .then((res) => res.json())
      .then((json) => {
        if (!json.error) setProfile(json.data);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-bg flex flex-col shadow-lg">
      <Header
        title={loading ? "Retailer Portal" : profile?.outletName ?? "Retailer Portal"}
        subtitle={loading ? "Manage your orders, invoices & payments" : profile?.outletAddress}
        showLogout
        userName={profile?.userName}
      />

      <main className="bg-white flex-1 p-4 pb-24">
        <div className="bg-dist text-white rounded-xl p-5 mb-5">
          <h2 className="text-2xl font-bold font-display">Welcome! 👋</h2>
          <p className="text-sm mt-2 opacity-90">
            Quickly place orders, track invoices and monitor your outstanding balance using the
            tabs below.
          </p>
        </div>

        <div className="flex flex-col items-center text-center mt-6 mb-6">
          <img src="/retailer.png" alt="Retailer Portal" className="w-30 h-30 object-contain" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {quickLinks.map(({ href, label, icon: Icon, desc }) => (
            <Link
              key={href}
              href={href}
              className="bg-surface border border-border rounded-xl p-4 flex flex-col items-start gap-2 active:bg-surface-2"
            >
              <div className="w-9 h-9 rounded-lg bg-dist-subtle flex items-center justify-center text-dist">
                <Icon size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{label}</p>
                <p className="text-xs text-text-muted mt-0.5">{desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}