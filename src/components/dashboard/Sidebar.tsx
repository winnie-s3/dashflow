"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Upload CSV",
    href: "/upload",
  },
  {
    label: "Relatórios",
    href: "/relatorios",
  },
  {
    label: "Configurações",
    href: "/configuracoes",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-64 border-r border-slate-800 bg-slate-900/70 p-6 md:block">
      <div>
        <h1 className="text-2xl font-bold text-white">DashFlow</h1>

        <p className="mt-1 text-sm text-slate-400">
          Painel empresarial
        </p>
      </div>

      <nav className="mt-10 space-y-2">
        {links.map((link) => {
          const isActive = pathname === link.href;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-xl px-4 py-3 font-medium transition ${
                isActive
                  ? "bg-cyan-400 text-slate-950"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}