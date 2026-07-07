"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const supabase = createSupabaseBrowserClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
<div className="max-w-sm mx-auto min-h-screen bg-white flex flex-col shadow-lg w-full"> 
       <main className="flex-1 px-6 py-10">
    <div className="w-full">
        <h1 className="text-2xl font-bold font-display text-text">Retailer Portal</h1>
        <p className="text-sm text-text-muted mt-1">Sign in to manage your shop</p>

      <form onSubmit={handleLogin} className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-sm font-semibold text-text-dim pt-4">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="shopowner@alnoor.test"
            className="h-12 px-3 border border-border rounded-lg bg-surface-2 focus:border-dist focus:outline-none focus:ring-2 focus:ring-dist/20 text-sm text-text"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="password" className="text-sm font-semibold text-text-dim">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="h-12 px-3 border border-border rounded-lg bg-surface-2 focus:border-dist focus:outline-none focus:ring-2 focus:ring-dist/20 text-sm text-text"
          />
        </div>

        {error && (
          <div className="bg-danger-subtle border border-danger/20 rounded-lg px-3 py-2 text-sm text-danger">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full h-12 bg-dist text-white rounded-lg font-semibold disabled:opacity-40 active:bg-dist-hover transition-colors"
        >
          {loading ? "Signing in…" : "Sign In"}
        </button>
      </form>
      </div>
      </main>
    </div>
    
  );
}