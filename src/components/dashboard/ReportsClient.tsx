"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabase";
import { Transaction } from "@/types/transaction";
import {
  calculateDashboardMetrics,
  formatCurrency,
} from "@/lib/dashboardCalculations";

export function ReportsClient() {
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
    } catch (err) {
      console.error("Erro ao carregar relatórios:", err);

      setError(
        err instanceof Error
          ? `Erro inesperado ao carregar os dados: ${err.message}`
          : "Erro inesperado ao carregar os dados."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadTransactions();
  }, []);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Carregando relatório...
        </p>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
        {error}
      </section>
    );
  }

  if (transactions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Relatórios
        </p>

        <h1 className="mt-2 text-3xl font-bold text-slate-950 dark:text-white">
          Nenhum dado disponível
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          Importe uma planilha CSV para gerar um relatório automático com resumo
          financeiro e operacional.
        </p>

        <Link
          href="/upload"
          className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
        >
          Importar CSV
        </Link>
      </section>
    );
  }

  const metrics = calculateDashboardMetrics(transactions);

  const totalRevenue = transactions
    .filter((item) => item.type === "receita")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.type === "despesa")
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingAmount = transactions
    .filter((item) => item.status === "pendente")
    .reduce((sum, item) => sum + item.amount, 0);

  const profit = totalRevenue - totalExpenses;

  const profitMargin =
    totalRevenue > 0 ? Math.round((profit / totalRevenue) * 100) : 0;

  const pendingPercentage =
    totalRevenue > 0 ? Math.round((pendingAmount / totalRevenue) * 100) : 0;

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Relatório automático
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
          Resumo executivo da planilha
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Análise gerada a partir dos dados salvos no Supabase.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <p className="text-sm text-slate-600 dark:text-slate-400">
              {metric.title}
            </p>

            <strong className="mt-3 block text-2xl font-bold text-slate-950 dark:text-white">
              {metric.value}
            </strong>

            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {metric.description}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
          Análise do período
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-600 dark:text-slate-400">
          <p>
            No período analisado, a empresa registrou{" "}
            <strong className="text-slate-950 dark:text-white">
              {formatCurrency(totalRevenue)}
            </strong>{" "}
            em receitas e{" "}
            <strong className="text-slate-950 dark:text-white">
              {formatCurrency(totalExpenses)}
            </strong>{" "}
            em despesas.
          </p>

          <p>
            O lucro estimado foi de{" "}
            <strong className="text-slate-950 dark:text-white">
              {formatCurrency(profit)}
            </strong>
            , representando uma margem aproximada de{" "}
            <strong className="text-slate-950 dark:text-white">
              {profitMargin}%
            </strong>
            .
          </p>

          <p>
            Existem{" "}
            <strong className="text-slate-950 dark:text-white">
              {formatCurrency(pendingAmount)}
            </strong>{" "}
            em valores pendentes, o que representa aproximadamente{" "}
            <strong className="text-slate-950 dark:text-white">
              {pendingPercentage}%
            </strong>{" "}
            da receita registrada.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {[
          {
            title: "Ponto positivo",
            text: "O dashboard já permite visualizar rapidamente receitas, despesas, pendências e categorias principais.",
          },
          {
            title: "Ponto de atenção",
            text: "Valores pendentes precisam ser acompanhados para evitar impacto no fluxo de caixa.",
          },
          {
            title: "Próxima ação sugerida",
            text: "Separar receitas recorrentes, despesas fixas e pagamentos atrasados para melhorar previsibilidade.",
          },
        ].map((item) => (
          <div
            key={item.title}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <h3 className="font-semibold text-slate-950 dark:text-white">
              {item.title}
            </h3>

            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
              {item.text}
            </p>
          </div>
        ))}
      </section>
    </div>
  );
}