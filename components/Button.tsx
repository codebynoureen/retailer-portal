type ButtonProps = {
  title: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
};

export default function Button({
  title,
  onClick,
  variant = "primary",
}: ButtonProps) {
  const styles =
    variant === "primary"
      ? "bg-dist text-white active:bg-dist-hover"
      : "bg-surface text-dist border-[1.5px] border-border-strong";

  return (
    <button
      onClick={onClick}
      className={`w-full h-12 rounded-lg font-semibold transition-colors duration-200 ${styles}`}
    >
      {title}
    </button>
  );
}