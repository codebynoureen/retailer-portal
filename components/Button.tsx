type ButtonProps = {
  title: string;
  onClick?: () => void;
};

export default function Button({
  title,
  onClick,
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-600 text-white px-4 py-2 rounded m-2 hover:bg-blue-700 transition-colors duration-300"
    >
      {title}
    </button>
  );
}
