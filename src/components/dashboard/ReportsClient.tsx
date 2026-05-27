"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Transaction } from "@/types/transaction";
import {
  calculateDashboardMetrics,
  formatCurrency,
} from "@/lib/dashboardCalculations";

export function ReportsClient() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const storedTransactions = localStorage.getItem("dashflow-transactions");

    if (storedTransactions) {
      setTransactions(JSON.parse(storedTransactions) as Transaction[]);
    }

    setIsLoaded(true);
  }, []);

  if (!isLoaded) return null;

  if (transactions.length === 0) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-700 bg-slate-900 p-10 text-center">
        <p className="text-sm text-cyan-300">Relatórios</p>

        <h1 className="mt-2 text-3xl font-bold text-white">
          Nenhum dado disponível
        </h1>

        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-400">
          Importe uma planilha CSV para gerar um relatório automático com resumo
          financeiro e operacional.
        </p>

        <Link
          href="/upload"
          className="mt-6 inline-flex rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
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
        <p className="text-sm text-cyan-300">Relatório automático</p>

        <h1 className="mt-1 text-3xl font-bold text-white">
          Resumo executivo da planilha
        </h1>

        <p className="mt-2 text-sm text-slate-400">
          Análise gerada a partir dos dados importados no DashFlow.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.title}
            className="rounded-2xl border border-slate-800 bg-slate-900 p-5"
          >
            <p className="text-sm text-slate-400">{metric.title}</p>
            <strong className="mt-3 block text-2xl text-white">
              {metric.value}
            </strong>
            <p className="mt-2 text-sm text-slate-500">
              {metric.description}
            </p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="text-xl font-semibold text-white">
          Análise do período
        </h2>

        <div className="mt-5 space-y-4 text-sm leading-7 text-slate-300">
          <p>
            No período analisado, a empresa registrou{" "}
            <strong className="text-white">{formatCurrency(totalRevenue)}</strong>{" "}
            em receitas e{" "}
            <strong className="text-white">{formatCurrency(totalExpenses)}</strong>{" "}
            em despesas.
          </p>

          <p>
            O lucro estimado foi de{" "}
            <strong className="text-white">{formatCurrency(profit)}</strong>,
            representando uma margem aproximada de{" "}
            <strong className="text-white">{profitMargin}%</strong>.
          </p>

          <p>
            Existem{" "}
            <strong className="text-white">{formatCurrency(pendingAmount)}</strong>{" "}
            em valores pendentes, o que representa aproximadamente{" "}
            <strong className="text-white">{pendingPercentage}%</strong> da
            receita registrada.
          </p>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="font-semibold text-white">Ponto positivo</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            O dashboard já permite visualizar rapidamente receitas, despesas,
            pendências e categorias principais.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="font-semibold text-white">Ponto de atenção</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Valores pendentes precisam ser acompanhados para evitar impacto no
            fluxo de caixa.
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
          <h3 className="font-semibold text-white">Próxima ação sugerida</h3>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Separar receitas recorrentes, despesas fixas e pagamentos atrasados
            para melhorar previsibilidade.
          </p>
        </div>
      </section>
    </div>
  );
}