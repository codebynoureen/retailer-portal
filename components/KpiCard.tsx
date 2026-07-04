type KpiCardProps = {
  value: string;
  label: string;
  color?: string;
};

export default function KpiCard({
  value,
  label,
  color = "text-text",
}: KpiCardProps) {
  return (
    <div className="bg-surface rounded-xl p-4 border border-border">
      <h2 className={`text-2xl font-bold font-display ${color}`}>{value}</h2>
      <p className="text-[11px] uppercase tracking-wide text-text-muted mt-1">
        {label}
      </p>
    </div>
  );
}