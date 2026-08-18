"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { NAV_ITEMS } from "@/lib/nav-items";
import { useAuth } from "@/lib/auth-context";

export default function NavTabs() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (pathname === "/login") return null;

  return (
    <header className="sticky top-0 z-10 relative overflow-hidden border-b border-neutral-200 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950/90">
      <Image
        src="/illustrations/house-lineart-banner.png"
        alt=""
        fill
        aria-hidden
        className="pointer-events-none select-none object-cover object-center opacity-25 dark:opacity-20 dark:invert"
      />
      {user && (
        <div className="relative mx-auto flex max-w-3xl justify-end px-4 pt-3">
          <button
            onClick={() => logout()}
            className="text-xs text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200"
          >
            Esci ({user.email})
          </button>
        </div>
      )}
      <nav className="relative mx-auto flex max-w-3xl gap-1 overflow-x-auto px-4 pb-3 pt-3">
        {NAV_ITEMS.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-neutral-900"
                  : "text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              <span className="mr-1">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
