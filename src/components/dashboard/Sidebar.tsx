"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

const links = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Upload CSV", href: "/upload" },
  { label: "Transações", href: "/transacoes" },
  { label: "Relatórios", href: "/relatorios" },
  { label: "Configurações", href: "/configuracoes" },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setUserEmail(data.user?.email ?? "");
    }

    loadUser();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  return (
    <aside className="sticky top-0 hidden h-screen w-72 flex-col border-r border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950 md:flex">
      <div>
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white dark:bg-white dark:text-slate-950">
          DF
        </div>

        <h1 className="mt-4 text-xl font-bold text-slate-950 dark:text-white">
          DashFlow
        </h1>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Gestão visual de planilhas
        </p>
      </div>

      <nav className="mt-10 space-y-1">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                isActive
                  ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950"
                  : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-8">
        <ThemeToggle />
      </div>

      <div className="mt-8 border-t border-slate-200 pt-6 dark:border-slate-800">
        {userEmail && (
          <div className="mb-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-900">
            <p className="text-xs text-slate-500 dark:text-slate-500">
              Usuário logado
            </p>
            <p className="mt-1 truncate text-sm font-medium text-slate-700 dark:text-slate-300">
              {userEmail}
            </p>
          </div>
        )}

        <button
          onClick={handleLogout}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-left text-sm font-medium text-slate-600 transition hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
        >
          Sair
        </button>
      </div>
    </aside>
  );
}