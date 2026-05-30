"use client";

import Papa from "papaparse";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Transaction } from "@/types/transaction";
import { supabase } from "@/lib/supabase";

type RawCsvRow = Record<string, string>;

type ColumnMapping = {
  date: string;
  category: string;
  client: string;
  description: string;
  amount: string;
  status: string;
};

const defaultMapping: ColumnMapping = {
  date: "",
  category: "",
  client: "",
  description: "",
  amount: "",
  status: "",
};

function normalizeStatus(status?: string) {
  const value = String(status ?? "").trim().toLowerCase();

  if (
    value.includes("pendente") ||
    value.includes("aberto") ||
    value.includes("em aberto") ||
    value.includes("não pago") ||
    value.includes("nao pago")
  ) {
    return "pendente";
  }

  return "pago";
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

function detectTransactionType(category?: string, description?: string) {
  const value = `${category ?? ""} ${description ?? ""}`.trim().toLowerCase();

  const expenseWords = [
    "despesa",
    "internet",
    "software",
    "aluguel",
    "fornecedor",
    "conta",
    "salário",
    "salario",
    "pagamento",
    "custo",
    "taxa",
  ];

  return expenseWords.some((word) => value.includes(word))
    ? "despesa"
    : "receita";
}

function getValue(row: RawCsvRow, columnName: string) {
  if (!columnName) return "";

  return String(row[columnName] ?? "").trim();
}

function convertRowToTransaction(
  row: RawCsvRow,
  mapping: ColumnMapping
): Transaction {
  const category = mapping.category
    ? getValue(row, mapping.category) || "Sem categoria"
    : "Sem categoria";

  const description = mapping.description
    ? getValue(row, mapping.description) || "Sem descrição"
    : "Sem descrição";

  return {
    date: mapping.date ? getValue(row, mapping.date) || "Sem data" : "Sem data",
    category,
    client: mapping.client
      ? getValue(row, mapping.client) || "Não informado"
      : "Não informado",
    description,
    amount: normalizeAmount(getValue(row, mapping.amount)),
    status: mapping.status
      ? normalizeStatus(getValue(row, mapping.status))
      : "pago",
    type: detectTransactionType(category, description),
    visible_fields: {
      date: Boolean(mapping.date),
      category: Boolean(mapping.category),
      client: Boolean(mapping.client),
      description: Boolean(mapping.description),
      status: Boolean(mapping.status),
    },
  };
}

function guessColumn(columns: string[], possibleNames: string[]) {
  const normalizedColumns = columns.map((column) => ({
    original: column,
    normalized: column.toLowerCase().trim(),
  }));

  const foundColumn = normalizedColumns.find((column) =>
    possibleNames.some((possibleName) =>
      column.normalized.includes(possibleName)
    )
  );

  return foundColumn?.original ?? "";
}

function createInitialMapping(columns: string[]): ColumnMapping {
  return {
    date: guessColumn(columns, ["data", "date", "vencimento", "emissão", "emissao"]),
    category: guessColumn(columns, ["categoria", "category", "tipo", "grupo"]),
    client: guessColumn(columns, ["cliente", "client", "nome", "empresa", "fornecedor"]),
    description: guessColumn(columns, ["descrição", "descricao", "description", "detalhe", "histórico", "historico"]),
    amount: guessColumn(columns, ["valor", "total", "amount", "preço", "preco", "receita", "despesa"]),
    status: guessColumn(columns, ["status", "situação", "situacao", "pagamento"]),
  };
}

type ImportRecord = {
  id: string;
  file_name: string;
  total_records: number;
  total_amount: number;
  created_at: string;
};

const sampleRows: RawCsvRow[] = [
  {
    data: "2026-05-01",
    categoria: "Vendas",
    cliente: "Cliente A",
    descricao: "Serviço mensal",
    valor: "1500",
    status: "pago",
  },
  {
    data: "2026-05-03",
    categoria: "Vendas",
    cliente: "Cliente B",
    descricao: "Projeto dashboard",
    valor: "2500",
    status: "pago",
  },
  {
    data: "2026-05-05",
    categoria: "Despesa",
    cliente: "Internet",
    descricao: "Conta mensal",
    valor: "120",
    status: "pago",
  },
  {
    data: "2026-05-08",
    categoria: "Software",
    cliente: "Ferramenta online",
    descricao: "Assinatura",
    valor: "89",
    status: "pago",
  },
  {
    data: "2026-05-10",
    categoria: "Vendas",
    cliente: "Cliente C",
    descricao: "Consultoria",
    valor: "800",
    status: "pendente",
  },
  {
    data: "2026-05-12",
    categoria: "Fornecedor",
    cliente: "Fornecedor X",
    descricao: "Compra operacional",
    valor: "450",
    status: "pago",
  },
];

export function UploadCsv() {
  const router = useRouter();

  const [rawRows, setRawRows] = useState<RawCsvRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>(defaultMapping);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [imports, setImports] = useState<ImportRecord[]>([]);
  const [isLoadingImports, setIsLoadingImports] = useState(false);
  
  function resetImport() {
    setRawRows([]);
    setColumns([]);
    setMapping(defaultMapping);
    setTransactions([]);
    setError(null);
    setSuccessMessage(null);
    setFileName("");
  }

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];

    setError(null);
    setSuccessMessage(null);
    setTransactions([]);
    setRawRows([]);
    setColumns([]);

    if (!file) return;

    setFileName(file.name);

    Papa.parse<RawCsvRow>(file, {
      header: true,
      skipEmptyLines: true,
      delimiter: "",
      complete: (result) => {
        const detectedColumns = result.meta.fields ?? [];

        if (detectedColumns.length === 0) {
          setError("Não foi possível identificar as colunas do arquivo.");
          return;
        }

        const cleanedRows = result.data.filter((row) =>
          Object.values(row).some((value) => String(value ?? "").trim() !== "")
        );

        if (cleanedRows.length === 0) {
          setError("O arquivo não possui registros válidos para importar.");
          return;
        }

        setColumns(detectedColumns);
        setRawRows(cleanedRows);
        setMapping(createInitialMapping(detectedColumns));
      },
      error: () => {
        setError("Erro ao ler o arquivo CSV.");
      },
    });
  }

  function handleGeneratePreview() {
    setError(null);
    setSuccessMessage(null);

    if (!mapping.amount) {
      setError("Selecione qual coluna representa o valor.");
      return;
    }

    const parsedTransactions = rawRows.map((row) =>
      convertRowToTransaction(row, mapping)
    );

    const hasRowsWithoutAmount = parsedTransactions.some(
      (transaction) => transaction.amount === 0
    );

    if (hasRowsWithoutAmount) {
      setError(
        "Algumas linhas vieram sem valor ou com valor inválido. Confira o mapeamento da coluna de valor."
      );
      return;
    }

    setTransactions(parsedTransactions);
  }

  function handleUseSampleFile() {
    const sampleColumns = ["data", "categoria", "cliente", "descricao", "valor", "status"];

    setError(null);
    setSuccessMessage(null);
    setTransactions([]);
    setRawRows(sampleRows);
    setColumns(sampleColumns);
    setMapping(createInitialMapping(sampleColumns));
    setFileName("arquivo-exemplo-dashflow.csv");
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

      const totalAmount = transactions.reduce(
        (sum, transaction) => sum + transaction.amount,
        0
      );

      const { data: importData, error: importError } = await supabase
        .from("imports")
        .insert({
          user_id: userId,
          file_name: fileName || "Arquivo importado",
          total_records: transactions.length,
          total_amount: totalAmount,
        })
        .select("id")
        .single();

      if (importError || !importData) {
        setError(
          `Erro ao criar registro da importação: ${
            importError?.message ?? "Importação não retornou ID."
          }`
        );
        return;
      }

      const transactionsWithUserId = transactions.map((transaction) => ({
        ...transaction,
        user_id: userId,
        import_id: importData.id,
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
      await loadImports();
      router.push("/dashboard");
    } catch (err) {
      console.error("Erro ao importar:", err);

      setError(
        err instanceof Error
          ? `Erro inesperado ao importar os dados: ${err.message}`
          : "Erro inesperado ao importar os dados."
      );
    } finally {
      setIsImporting(false);
    }
  }

  async function loadImports() {
    try {
      setIsLoadingImports(true);

      const { data: sessionData } = await supabase.auth.getSession();
      const userId = sessionData.session?.user.id;

      if (!userId) return;

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
    } finally {
      setIsLoadingImports(false);
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

    setImports((currentImports) =>
      currentImports.filter((item) => item.id !== importId)
    );
  }

  useEffect(() => {
    loadImports();
  }, []);

  function renderSelect(
    label: string,
    field: keyof ColumnMapping,
    required = false
  ) {
    return (
      <div>
        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>

        <select
          value={mapping[field]}
          onChange={(event) =>
            setMapping((currentMapping) => ({
              ...currentMapping,
              [field]: event.target.value,
            }))
          }
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none transition focus:border-blue-500 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200"
        >
          <option value="">Não usar</option>

          {columns.map((column) => (
            <option key={column} value={column}>
              {column}
            </option>
          ))}
        </select>
      </div>
    );
  }

  const visiblePreviewFields = {
    date: transactions.some((transaction) => transaction.visible_fields?.date),
    category: transactions.some(
      (transaction) => transaction.visible_fields?.category
    ),
    client: transactions.some(
      (transaction) => transaction.visible_fields?.client
    ),
    description: transactions.some(
      (transaction) => transaction.visible_fields?.description
    ),
    status: transactions.some(
      (transaction) => transaction.visible_fields?.status
    ),
  };

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
            Envie uma planilha CSV e escolha quais colunas representam os dados
            principais. Assim o DashFlow consegue importar arquivos com modelos
            diferentes.
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
              O arquivo pode ter nomes de colunas diferentes. Você fará o
              mapeamento antes da importação.
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

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={handleUseSampleFile}
            className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700 transition hover:bg-blue-100 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300 dark:hover:bg-blue-900"
          >
            Usar arquivo de exemplo
          </button>
          <Link
            href="/importacoes"
            className="rounded-xl border border-slate-700 px-4 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800"
          >
            Ver importações anteriores
          </Link>
        </div>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <h3 className="font-semibold text-slate-950 dark:text-white">
            Como preparar o arquivo
          </h3>

          <div className="mt-3 space-y-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
            <p>
              O DashFlow aceita arquivos CSV com cabeçalho na primeira linha. O nome das
              colunas não precisa seguir um padrão fixo, porque você poderá mapear cada
              coluna antes da importação.
            </p>

            <p>
              A única informação obrigatória é uma coluna de valor. As demais são
              opcionais, mas ajudam o dashboard a gerar análises melhores.
            </p>

            <p>
              Colunas recomendadas: data, categoria, cliente, descrição, valor e status.
            </p>
          </div>
        </div>

        {fileName && (
          <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Arquivo selecionado:{" "}
              <span className="font-medium text-slate-950 dark:text-white">
                {fileName}
              </span>
            </p>

            <button
              type="button"
              onClick={resetImport}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
            >
              Escolher outro arquivo
            </button>
          </div>
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

      {rawRows.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div>
            <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
              Mapeamento de colunas
            </h3>

            <p className="mt-1 text-sm leading-6 text-slate-600 dark:text-slate-400">
              Encontramos {columns.length} colunas e {rawRows.length} registros.
              Selecione quais colunas devem ser usadas no dashboard.
            </p>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {renderSelect("Valor", "amount", true)}
            {renderSelect("Data", "date")}
            {renderSelect("Cliente", "client")}
            {renderSelect("Categoria", "category")}
            {renderSelect("Descrição", "description")}
            {renderSelect("Status", "status")}
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={handleGeneratePreview}
              className="rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
            >
              Gerar preview
            </button>
          </div>
        </section>
      )}

      {transactions.length > 0 && (
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
                Preview dos dados
              </h3>

              <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
                {transactions.length} registros prontos para importação.
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
                  {visiblePreviewFields.date && (
                    <th className="whitespace-nowrap pb-3 pr-6 font-medium">Data</th>
                  )}

                  {visiblePreviewFields.category && (
                    <th className="whitespace-nowrap pb-3 pr-6 font-medium">Categoria</th>
                  )}

                  {visiblePreviewFields.client && (
                    <th className="whitespace-nowrap pb-3 pr-6 font-medium">Cliente</th>
                  )}

                  {visiblePreviewFields.description && (
                    <th className="whitespace-nowrap pb-3 pr-6 font-medium">Descrição</th>
                  )}

                  <th className="whitespace-nowrap pb-3 pr-6 font-medium">Tipo</th>

                  {visiblePreviewFields.status && (
                    <th className="whitespace-nowrap pb-3 pr-6 font-medium">Status</th>
                  )}

                  <th className="whitespace-nowrap pb-3 font-medium">Valor</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {transactions.map((transaction, index) => (
                  <tr key={`${transaction.client}-${transaction.date}-${index}`}>
                    {visiblePreviewFields.date && (
                      <td className="whitespace-nowrap py-4 pr-6 text-slate-600 dark:text-slate-300">
                        {transaction.date}
                      </td>
                    )}

                    {visiblePreviewFields.category && (
                      <td className="whitespace-nowrap py-4 pr-6 text-slate-600 dark:text-slate-300">
                        {transaction.category}
                      </td>
                    )}

                    {visiblePreviewFields.client && (
                      <td className="whitespace-nowrap py-4 pr-6 font-medium text-slate-950 dark:text-white">
                        {transaction.client}
                      </td>
                    )}

                    {visiblePreviewFields.description && (
                      <td className="min-w-52 py-4 pr-6 text-slate-500 dark:text-slate-400">
                        {transaction.description}
                      </td>
                    )}

                    <td className="whitespace-nowrap py-4 pr-6">
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

                    {visiblePreviewFields.status && (
                      <td className="whitespace-nowrap py-4 pr-6">
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
                    )}

                    <td className="whitespace-nowrap py-4 text-slate-600 dark:text-slate-300">
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