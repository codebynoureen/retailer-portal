import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-sm mx-auto min-h-screen bg-gray-50 shadow-lg flex flex-col">

      <Header
        title="Retailer Portal"
        subtitle="Manage your orders, invoices & payments"
      />

      <main className="flex-1 p-4">

        {/* Welcome Card */}
        <div className="bg-cyan-600 text-white rounded-2xl p-5 mb-5">
          <h2 className="text-2xl font-bold">
            Welcome, Noureen 👋
          </h2>

          <p className="text-sm mt-2 opacity-90">
            Quickly place orders, track invoices and monitor your outstanding balance.
          </p>
        </div>

        {/* Quick Actions */}
        <h3 className="font-semibold text-gray-700 mb-3">
          Quick Actions
        </h3>

        <div className="space-y-3">

          <Link href="/catalogue">
            <button className="w-full bg-cyan-600 text-white py-3 rounded-xl font-semibold">
              🛒 Place New Order
            </button>
          </Link>

          <Link href="/orders">
            <button className="w-full bg-white border py-3 rounded-xl font-semibold">
              📦 View Orders
            </button>
          </Link>

          <Link href="/outstanding">
            <button className="w-full bg-white border py-3 rounded-xl font-semibold">
              💳 Outstanding Balance
            </button>
          </Link>

          <Link href="/invoices/1">
            <button className="w-full bg-white border py-3 rounded-xl font-semibold">
              📄 Latest Invoice
            </button>
          </Link>

        </div>

      </main>

      <Footer />

    </div>
  );
}