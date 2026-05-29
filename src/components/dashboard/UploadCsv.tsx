"use client";

import Papa from "papaparse";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabase";

type CsvRow = {
  data?: string;
  categoria?: string;
  cliente?: string;
  descricao?: string;
  valor?: string;
  status?: string;
};

const requiredColumns = ["data", "categoria", "cliente", "descricao", "valor", "status"];

function normalizeStatus(status?: string) {
  const value = String(status ?? "").trim().toLowerCase();
  if (value === "pago") return "pago";
  if (value === "pendente") return "pendente";
  return "pendente";
}

function normalizeAmount(value?: string) {
  const rawValue = String(value ?? "").trim();
  if (!rawValue) return 0;

  const cleanValue = rawValue
    .replace("R$", "")
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const amount = Number(cleanValue);
  return Number.isNaN(amount) ? 0 : amount;
}

function detectTransactionType(category?: string) {
  const value = String(category ?? "").trim().toLowerCase();

  const expenseWords = [
    "despesa",
    "internet",
    "software",
    "aluguel",
    "fornecedor",
    "conta",
    "salário",
    "salario",
  ];

  return expenseWords.some((word) => value.includes(word)) ? "despesa" : "receita";
}

function validateColumns(fields: string[] | undefined) {
  if (!fields) return "Não foi possível identificar as colunas do CSV.";

  const normalizedFields = fields.map((field) => field.trim().toLowerCase());

  const missingColumns = requiredColumns.filter(
    (column) => !normalizedFields.includes(column)
  );

  if (missingColumns.length > 0) {
    return `Colunas obrigatórias ausentes: ${missingColumns.join(", ")}`;
  }

  return null;
}

function convertRowToTransaction(row: CsvRow): Transaction {
  return {
    date: String(row.data ?? "").trim(),
    category: String(row.categoria ?? "").trim(),
    client: String(row.cliente ?? "").trim(),
    description: String(row.descricao ?? "").trim(),
    amount: normalizeAmount(row.valor),
    status: normalizeStatus(row.status),
    type: detectTransactionType(row.categoria),
  };
}

export function UploadCsv() {
  const router = useRouter();

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setError(null);
    setSuccessMessage(null);
    setTransactions([]);

    if (!file) return;

    setFileName(file.name);

    Papa.parse<CsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: "",
      complete: (result) => {
        const columnError = validateColumns(result.meta.fields);

        if (columnError) {
          setError(columnError);
          return;
        }

        const parsedTransactions = result.data
          .filter((row) =>
            Object.values(row).some((value) => String(value ?? "").trim() !== "")
          )
          .map(convertRowToTransaction);

        const hasRowsWithoutAmount = parsedTransactions.some(
          (transaction) => transaction.amount === 0
        );

        if (hasRowsWithoutAmount) {
          setError(
            "Algumas linhas vieram sem valor ou com valor inválido. Corrija a coluna valor no CSV."
          );
          return;
        }

        setTransactions(parsedTransactions);
      },
      error: () => {
        setError("Erro ao ler o arquivo CSV.");
      },
    });
  }

  async function handleConfirmImport() {
    try {
      setIsImporting(true);
      setError(null);
      setSuccessMessage(null);

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) {
        setError("Usuário não autenticado.");
        return;
      }

      const transactionsWithUserId = transactions.map((transaction) => ({
        ...transaction,
        user_id: userId,
      }));

      const { error } = await supabase
        .from("transactions")
        .insert(transactionsWithUserId);

      if (error) {
        setError(`Erro ao salvar no Supabase: ${error.message}`);
        return;
      }

      localStorage.setItem(
        "dashflow-transactions",
        JSON.stringify(transactionsWithUserId)
      );

      setSuccessMessage("Dados importados com sucesso!");
      router.push("/dashboard");
    } catch {
      setError("Erro inesperado ao importar os dados.");
    } finally {
      setIsImporting(false);
    }
  }

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div>
          <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
            Importação de dados
          </p>

          <h2 className="mt-1 text-2xl font-bold text-slate-950 dark:text-white sm:text-3xl">
            Upload de planilha CSV
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
            Envie uma planilha com dados financeiros ou operacionais. O sistema
            vai ler o arquivo, validar as colunas e mostrar uma prévia dos dados
            antes da importação.
          </p>
        </div>

        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 dark:border-slate-700 dark:bg-slate-950">
          <label
            htmlFor="csv-file"
            className="flex cursor-pointer flex-col items-center justify-center rounded-xl p-6 text-center transition hover:bg-slate-200 dark:hover:bg-slate-900"
          >
            <span className="text-lg font-semibold text-slate-950 dark:text-white">
              Clique para selecionar um CSV
            </span>

            <span className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              Colunas esperadas: data, categoria, cliente, descricao, valor, status
            </span>

            <input
              id="csv-file"
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        </div>

        {fileName && (
          <p className="mt-4 text-sm text-slate-600 dark:text-slate-400">
            Arquivo selecionado:{" "}
            <span className="font-medium text-slate-950 dark:text-white">
              {fileName}
            </span>
          </p>
        )}

        {error && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950 dark:text-red-300">
            {error}
          </div>
        )}

        {successMessage && (
          <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950 dark:text-emerald-300">
            {successMessage}
          </div>
        )}
      </section>

      {transactions.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                Preview dos dados
              </h3>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {transactions.length} registros encontrados no arquivo.
              </p>
            </div>

            <button
              onClick={handleConfirmImport}
              disabled={isImporting}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isImporting ? "Importando..." : "Confirmar importação"}
            </button>
          </div>

          <div className="mt-6 -mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                <tr>
                  <th className="pb-3 font-medium">Data</th>
                  <th className="pb-3 font-medium">Categoria</th>
                  <th className="pb-3 font-medium">Cliente</th>
                  <th className="pb-3 font-medium">Descrição</th>
                  <th className="pb-3 font-medium">Tipo</th>
                  <th className="pb-3 font-medium">Status</th>
                  <th className="pb-3 font-medium">Valor</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((transaction, index) => (
                  <tr key={`${transaction.client}-${transaction.date}-${index}`}>
                    <td className="py-4 text-slate-600 dark:text-slate-300">
                      {transaction.date}
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-300">
                      {transaction.category}
                    </td>
                    <td className="py-4 font-medium text-slate-950 dark:text-white">
                      {transaction.client}
                    </td>
                    <td className="py-4 text-slate-500 dark:text-slate-400">
                      {transaction.description}
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          transaction.type === "receita"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {transaction.type}
                      </span>
                    </td>
                    <td className="py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          transaction.status === "pago"
                            ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                        }`}
                      >
                        {transaction.status}
                      </span>
                    </td>
                    <td className="py-4 text-slate-600 dark:text-slate-300">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(transaction.amount)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}