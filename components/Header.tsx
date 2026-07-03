type HeaderProps = {
  title: string;
  subtitle?: string;
};

export default function Header({
  title,
  subtitle,
}: HeaderProps) {
  return (
    <header className="bg-blue-500 text-white p-4">
      <h1 className="text-2xl font-bold">
        {title}
      </h1>

      {subtitle && (
        <p className="text-sm text-white-500 mt-1">
          {subtitle}
        </p>
      )}
    </header>
  );
}