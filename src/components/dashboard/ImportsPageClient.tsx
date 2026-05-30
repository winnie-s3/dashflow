"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { ImportRecord } from "@/types/transaction";

export function ImportsPageClient() {
  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadImports() {
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
        .from("imports")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        setError(`Erro ao buscar importações: ${error.message}`);
        return;
      }

      setImports((data ?? []) as ImportRecord[]);
    } catch (err) {
      setError(
        err instanceof Error
          ? `Erro inesperado ao carregar importações: ${err.message}`
          : "Erro inesperado ao carregar importações."
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDeleteImport(importId: string) {
    const confirmed = window.confirm(
      "Tem certeza que deseja excluir esta importação? As transações vinculadas também serão removidas."
    );

    if (!confirmed) return;

    const { error } = await supabase.from("imports").delete().eq("id", importId);

    if (error) {
      setError(`Erro ao excluir importação: ${error.message}`);
      return;
    }

    setImports((current) => current.filter((item) => item.id !== importId));
  }

  useEffect(() => {
    loadImports();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Histórico de importações
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
          Arquivos importados
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Veja os relatórios enviados para sua conta e exclua importações quando necessário.
        </p>
      </header>

      {isLoading && (
        <section className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Carregando importações...
          </p>
        </section>
      )}

      {error && (
        <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
          {error}
        </section>
      )}

      {!isLoading && !error && imports.length === 0 && (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
          <h2 className="text-xl font-semibold text-slate-950 dark:text-white">
            Nenhuma importação encontrada
          </h2>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Quando você importar um arquivo, ele aparecerá aqui.
          </p>
        </section>
      )}

      {!isLoading && !error && imports.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="space-y-3">
            {imports.map((item) => (
              <div
                key={item.id}
                className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 sm:flex-row sm:items-center"
              >
                <div>
                  <p className="font-medium text-slate-950 dark:text-white">
                    {item.file_name}
                  </p>

                  <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                    {item.total_records} registros •{" "}
                    {new Intl.NumberFormat("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }).format(Number(item.total_amount))}{" "}
                    •{" "}
                    {new Date(item.created_at).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteImport(item.id)}
                  className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 dark:border-red-900 dark:text-red-300 dark:hover:bg-red-950"
                >
                  Excluir
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}