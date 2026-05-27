"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Transaction } from "@/types/transaction";
import {
  calculateDashboardMetrics,
  groupByCategory,
  groupRevenueAndExpensesByMonth,
} from "@/lib/dashboardCalculations";

import { DashboardHeader } from "./DashboardHeader";
import { MetricsGrid } from "./MetricsGrid";
import { OperationalSummary } from "./OperationalSummary";
import { RevenueExpenseChart } from "./RevenueExpenseChart";
import { CategoryChart } from "./CategoryChart";
import { TransactionsTable } from "./TransactionsTable";

export function DashboardClient() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("dashflow-transactions");

    if (storedTransactions) {
      const parsedTransactions = JSON.parse(storedTransactions) as Transaction[];
      setTransactions(parsedTransactions);
    }

    setIsLoaded(true);
  }, []);

  function handleClearData() {
    localStorage.removeItem("dashflow-transactions");
    setTransactions([]);
  }

  if (!isLoaded) {
    return null;
  }

  if (transactions.length === 0) {
    return (
      <>
        <DashboardHeader />

        <section className="mt-8 rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
          <p className="text-sm text-cyan-300">Nenhum dado importado</p>

          <h2 className="mt-2 text-2xl font-bold text-white">
            Importe uma planilha para gerar o dashboard
          </h2>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
            O DashFlow transforma dados de planilhas em métricas, gráficos,
            tabela e resumo operacional.
          </p>

          <Link
            href="/upload"
            className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Importar CSV
          </Link>
        </section>
      </>
    );
  }

  const metrics = calculateDashboardMetrics(transactions);
  const revenueExpenseData = groupRevenueAndExpensesByMonth(transactions);
  const categoryData = groupByCategory(transactions);

  return (
    <>
      <DashboardHeader />

      <div className="mt-6 flex justify-end">
        <button
          onClick={handleClearData}
          className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-300 hover:bg-slate-800"
        >
          Limpar dados importados
        </button>
      </div>

      <MetricsGrid metrics={metrics} />

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <RevenueExpenseChart data={revenueExpenseData} />
        <OperationalSummary />
      </section>

      <section className="mt-8 grid gap-6 xl:grid-cols-3">
        <CategoryChart data={categoryData} />

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
          <h3 className="text-lg font-semibold text-white">Análise rápida</h3>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Os dados importados foram organizados automaticamente em indicadores,
            categorias e visão mensal. Essa análise ajuda a identificar receitas,
            despesas, pendências e oportunidades de melhoria operacional.
          </p>
        </div>
      </section>

      <TransactionsTable transactions={transactions} />
    </>
  );
}