"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ImportRecord, Transaction } from "@/types/transaction";
import { TransactionsTable } from "./TransactionsTable";

export function TransactionsPageClient() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadData() {
    try {
      setIsLoading(true);
      setError(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        setError("Usuário não autenticado.");
        return;
      }

      const { data: importsData, error: importsError } = await supabase
        .from("imports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (importsError) {
        setError(`Erro ao buscar importações: ${importsError.message}`);
        return;
      }

      const { data: transactionsData, error: transactionsError } =
        await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", userId)
          .order("created_at", { ascending: false });

      if (transactionsError) {
        setError(`Erro ao buscar transações: ${transactionsError.message}`);
        return;
      }

      setImports((importsData ?? []) as ImportRecord[]);
      setTransactions((transactionsData ?? []) as Transaction[]);
    } catch (err) {
      console.error("Erro ao carregar transações:", err);

      setError(
        err instanceof Error
          ? `Erro inesperado ao carregar transações: ${err.message}`
          : "Erro inesperado ao carregar transações."
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

  if (isLoading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <p className="text-sm text-slate-600 dark:text-slate-400">
          Carregando transações...
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

  return (
    <div>
      <header>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Histórico completo
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
          Todas as transações
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Visualize todas as importações e registros salvos na sua conta.
        </p>
      </header>

      <TransactionsTable
        transactions={transactions}
        imports={imports}
        showViewAllButton={false}
      />
    </div>
  );
}