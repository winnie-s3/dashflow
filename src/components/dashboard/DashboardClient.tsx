"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
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
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadTransactions() {
    try {
      setIsLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();

      const userId = sessionData.session?.user.id;

      if (!userId) {
        setError("Usuário não autenticado.");
        return;
      }

      const { data, error } = await supabase
        .from("transactions")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setError(`Erro ao buscar dados: ${error.message}`);
        return;
      }

      setTransactions((data ?? []) as Transaction[]);
    } catch {
      setError("Erro inesperado ao carregar os dados.");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleClearData() {
    const { data: sessionData } = await supabase.auth.getSession();

    const userId = sessionData.session?.user.id;

    if (!userId) {
      setError("Usuário não autenticado.");
      return;
    }

    const { error } = await supabase
      .from("transactions")
      .delete()
      .eq("user_id", userId);

    if (error) {
      setError(`Erro ao limpar dados: ${error.message}`);
      return;
    }

    setTransactions([]);
    localStorage.removeItem("dashflow-transactions");
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  if (isLoading) {
    return (
      <>
        <DashboardHeader />

        <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-10 text-center">
          <p className="text-sm text-slate-400">Carregando dashboard...</p>
        </section>
      </>
    );
  }

  if (error) {
    return (
      <>
        <DashboardHeader />

        <section className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-6 text-red-300">
          {error}
        </section>
      </>
    );
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
          className="rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          Limpar dados importados
        </button>
      </div>

      <MetricsGrid metrics={metrics} />

      <section className="mt-6 grid gap-4 lg:grid-cols-3 lg:gap-6">
        <RevenueExpenseChart data={revenueExpenseData} />
        <OperationalSummary />
      </section>

      <section className="mt-6 grid gap-4 lg:grid-cols-3 lg:gap-6">
        <CategoryChart data={categoryData} />

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Análise rápida</h3>

          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
            Os dados importados foram carregados do banco e organizados
            automaticamente em indicadores, categorias e visão mensal.
          </p>
        </div>
      </section>

      <TransactionsTable transactions={transactions} />
    </>
  );
}