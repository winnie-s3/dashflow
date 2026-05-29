import Link from "next/link";

export function DashboardHeader() {
  return (
    <header className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
      <div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Visão geral
        </p>

        <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-950 dark:text-white sm:text-3xl">
          Dashboard financeiro
        </h2>

        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Dados importados da planilha da empresa.
        </p>
      </div>

      <Link
        href="/upload"
        className="w-full rounded-xl bg-slate-950 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800 dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200 sm:w-auto"
      >
        Importar planilha
      </Link>
    </header>
  );
}