"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Upload", href: "/upload" },
  { label: "Relatórios", href: "/relatorios" },
  { label: "Config.", href: "/configuracoes" },
];

export function MobileHeader() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <header className="sticky top-0 z-30 w-full max-w-full overflow-hidden border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur dark:border-slate-800 dark:bg-slate-950/90 md:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link href="/dashboard" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-xs font-bold text-white dark:bg-white dark:text-slate-950">
            DF
          </div>

          <div>
            <p className="text-sm font-bold text-slate-950 dark:text-white">
              DashFlow
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Painel
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <ThemeToggle />

          <button
            onClick={handleLogout}
            className="rounded-xl border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 dark:border-slate-800 dark:text-slate-300"
          >
            Sair
          </button>
        </div>
      </div>

      <nav className="mt-3 flex max-w-full gap-2 overflow-x-auto pb-1">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`whitespace-nowrap rounded-xl px-3 py-2 text-xs font-medium transition ${
                isActive
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}