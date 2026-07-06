"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, FileText, ShoppingCart, Package } from "lucide-react";

const tabs = [
  { href: "/", label: "Home", icon: Home, exact: true },
  { href: "/outstanding", label: "Outstanding", icon: Wallet },
  { href: "/invoices", label: "Invoices", icon: FileText },
  { href: "/catalogue", label: "Order", icon: ShoppingCart },
  { href: "/orders", label: "My Orders", icon: Package },
];

export default function Footer() {
  const pathname = usePathname();

  return (
    <nav className=" print:hidden fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm h-16 bg-surface border-t border-border flex z-50 shadow-[0_-2px_12px_rgba(15,23,42,0.06)]">
      {tabs.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact
          ? pathname === href
          : pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            className={`flex-1 flex flex-col items-center justify-center gap-1 ${
              isActive ? "text-dist" : "text-text-muted"
            }`}
          >
            <Icon size={20} strokeWidth={2} />
            <span className="text-[9px] font-semibold">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}