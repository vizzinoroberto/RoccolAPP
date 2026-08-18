/**
 * Central registry of top-level tabs.
 * To add a new tab: create a page under src/app/<route>/page.tsx,
 * then add an entry here — it will appear automatically in the nav bar.
 */
export type NavItem = {
  href: string;
  label: string;
  icon: string; // emoji, swapped for real icons later
};

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Calendario", icon: "📅" },
  { href: "/spesa", label: "Spesa", icon: "🛒" },
  { href: "/todo", label: "To Do", icon: "✅" },
];
