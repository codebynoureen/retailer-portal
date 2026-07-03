export default function CreditMeter() {
  return (
    <div className="bg-blue-900 text-white rounded-xl p-6 mt-6">
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm">Credit Meter</p>
          <h2 className="text-3xl font-bold mt-2">92%</h2>
        </div>

        <div className="text-right">
          <p className="text-sm">Outstanding</p>
          <h2 className="text-2xl font-bold">$4,600</h2>
        </div>
      </div>

      <div className="w-full bg-blue-700 h-3 rounded-full mt-6">
        <div className="bg-green-400 h-3 rounded-full w-[92%]"></div>
      </div>
    </div>
  );
}