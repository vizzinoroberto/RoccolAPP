"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (user) {
    router.replace("/");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login(email, password, remember);
      router.replace("/");
    } catch {
      setError("Email o password non corretti.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <Image
        src="/illustrations/house-lineart.png"
        alt=""
        fill
        priority
        aria-hidden
        className="pointer-events-none select-none object-cover object-bottom opacity-90 dark:opacity-70 dark:invert"
      />

      <form
        onSubmit={handleSubmit}
        className="relative z-10 w-full max-w-sm rounded-2xl border border-neutral-200 bg-white/85 p-6 shadow-sm backdrop-blur-sm dark:border-neutral-800 dark:bg-neutral-950/85"
      >
        <h1 className="mb-1 text-xl font-semibold">RoccolAPP</h1>
        <p className="mb-6 text-sm text-neutral-500">Accedi per continuare</p>

        <label className="mb-3 block text-sm">
          Email
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            inputMode="email"
            autoCapitalize="none"
            autoCorrect="off"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"
          />
        </label>

        <label className="mb-4 block text-sm">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="mt-1 w-full rounded-lg border border-neutral-200 px-3 py-3 text-sm dark:border-neutral-800 dark:bg-neutral-900"
          />
        </label>

        <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
            className="h-5 w-5 accent-neutral-900 dark:accent-white"
          />
          Ricordami
        </label>

        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-neutral-900 px-4 py-3 text-sm font-medium text-white disabled:opacity-50 dark:bg-white dark:text-neutral-900"
        >
          {loading ? "Accesso..." : "Accedi"}
        </button>
      </form>
    </div>
  );
}
