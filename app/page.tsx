"use client";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import { usePathname } from "next/navigation";

const quickActions = [
  {
    href: "/catalogue",
    label: "Place New Order",
    description: "Browse products & add to cart",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m-10 0a2 2 0 100 4 2 2 0 000-4zm10 0a2 2 0 100 4 2 2 0 000-4z"
        />
      </svg>
    ),
  },
  {
    href: "/orders",
    label: "View Orders",
    description: "Track current & past orders",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
        />
      </svg>
    ),
  },
  {
    href: "/outstanding",
    label: "Outstanding Balance",
    description: "Check what you owe",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V6m0 10v2m9-8a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
    ),
  },
  {
    href: "/invoices",
    label: "Latest Invoice",
    description: "View your most recent bill",
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    ),
  },
];

export default function Home() {
  const pathname = usePathname();

  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 shadow-lg flex flex-col">
      <Header
        title="Retailer Portal"
        subtitle="Manage your orders, invoices & payments"
      />

      <main className="flex-1 p-4">
        {/* Welcome Card */}
        <div className="bg-gradient-to-br from-cyan-600 to-cyan-700 text-white rounded-2xl p-5 mb-6 shadow-sm">
          <h2 className="text-xl font-bold">Welcome back, Noureen</h2>
          <p className="text-sm mt-1.5 text-cyan-50/90 leading-relaxed">
            Quickly place orders, track invoices and monitor your outstanding
            balance — all in one place.
          </p>
        </div>

        {/* Quick Actions */}
        <h3 className="font-semibold text-gray-800 mb-3 text-sm tracking-wide uppercase">
          Quick Actions
        </h3>

        <div className="space-y-3">
          {quickActions.map((action) => {
            const isActive = pathname === action.href;

            return (
              <Link key={action.href} href={action.href}>
                <div
                  className={`w-full flex items-center gap-3 py-3 px-4 rounded-xl border transition ${
                    isActive
                      ? "bg-cyan-600 border-cyan-600 text-white ring-2 ring-cyan-300 ring-offset-1"
                      : "bg-white border-gray-200 text-gray-800 hover:border-cyan-300 hover:shadow-sm"
                  }`}
                >
                  <span className={isActive ? "text-white" : "text-cyan-700"}>
                    {action.icon}
                  </span>

                  <div className="text-left">
                    <p className="font-semibold text-sm">{action.label}</p>
                    <p
                      className={`text-xs mt-0.5 ${
                        isActive ? "text-cyan-50/80" : "text-gray-500"
                      }`}
                    >
                      {action.description}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>

      <Footer />
    </div>
  );
}