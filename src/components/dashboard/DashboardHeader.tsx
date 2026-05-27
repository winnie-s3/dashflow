import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <p className="text-sm text-cyan-300">Visão geral</p>
        <h2 className="mt-1 text-3xl font-bold text-white">
          Dashboard financeiro
        </h2>
        <p className="mt-2 text-sm text-slate-400">
          Dados importados da planilha da empresa.
        </p>
      </div>

      <Link
        href="/upload"
        className="rounded-xl bg-cyan-400 px-5 py-3 text-center font-semibold text-slate-950 transition hover:bg-cyan-300"
      >
        Importar planilha
      </Link>
    </header>
  );
}