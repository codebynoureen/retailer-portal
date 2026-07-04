type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="bg-surface border-b border-border p-4 sticky top-0 z-40">
      <h1 className="text-xl font-bold font-display text-text">{title}</h1>
      {subtitle && (
        <p className="text-sm text-text-muted mt-1">{subtitle}</p>
      )}
    </header>
  );
}