"use client";

import { useRouter } from "next/navigation";

type HeaderProps = {
  title: string;
  subtitle?: string;
  showLogout?: boolean;
  userName?: string;
};

function getInitial(name?: string) {
  if (!name || name.trim().length === 0) return "?";
  return name.trim().charAt(0).toUpperCase();
}

export default function Header({ title, subtitle, showLogout, userName }: HeaderProps) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header className="print:hidden bg-surface border-b border-border p-4 sticky top-0 z-40 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold font-display text-text">{title}</h1>
        {subtitle && <p className="text-sm text-text-muted mt-1">{subtitle}</p>}
      </div>

      {showLogout && (
        <div className="flex items-center gap-2 shrink-0">
          <div
            title={userName}
            className="w-9 h-9 rounded-full bg-dist-subtle text-dist font-bold text-sm flex items-center justify-center"
          >
            {getInitial(userName)}
          </div>
          <button
            onClick={handleLogout}
            className="text-xs font-semibold text-dist border border-border rounded-lg px-3 py-2 active:bg-dist-subtle"
          >
            Sign Out
          </button>
        </div>
      )}
    </header>
  );
}