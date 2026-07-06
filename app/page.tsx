import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="max-w-sm mx-auto min-h-screen bg-bg flex flex-col">
      <Header
        title="Retailer Portal"
        subtitle="Manage your orders, invoices & payments"
      />

      <main className=" bg-white flex-1 p-4 pb-24">
        {/* Welcome Card */}
        <div className="bg-dist text-white rounded-xl p-5 mb-5">
          <h2 className="text-2xl font-bold font-display">
            Welcome, Noureen 👋
          </h2>
          <p className="text-sm mt-2 opacity-90">
            Quickly place orders, track invoices and monitor your outstanding
            balance using the tabs below.
          </p>
        </div>
       <div className="flex flex-col items-center text-center mt-10">
  <img
    src="/retailer.png"
    alt="Retailer Portal"
    className="w-50 h-50 object-contain"
  />

  <h2 className="mt-5 text-2xl font-bold text-gray-800">
    Manage Your Shop Anytime
  </h2>

  <p className="mt-3 text-gray-600 text-sm leading-6 max-w-xs">
    Welcome to the Retailer Portal. Easily browse products, place new
    orders, track invoices, and monitor your outstanding balance from one
    simple dashboard.
  </p>
</div>
      </main>

      <Footer />
    </div>
  );
}