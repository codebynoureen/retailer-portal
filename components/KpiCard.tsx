type KpiCardProps = {
  value: string;
  label: string;
  color?: string;
};

export default function KpiCard({
  value,
  label,
  color = "text-black",
}: KpiCardProps) {
  return (
    <div className="bg-white rounded-xl p-4 border">
      <h2 className={`text-3xl font-bold ${color}`}>
        {value}
      </h2>

      <p className="text-sm text-gray-500 mt-1">
        {label}
      </p>
    </div>
  );
}