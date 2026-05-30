import Link from "next/link";
import { formatCurrency } from "@/lib/dashboardCalculations";
import { ImportRecord, Transaction } from "@/types/transaction";

type TransactionsTableProps = {
  transactions: Transaction[];
  imports: ImportRecord[];
};

function shouldShowField(
  transactions: Transaction[],
  field: "date" | "category" | "client" | "description" | "status"
) {
  const hasVisibleFields = transactions.some(
    (transaction) => transaction.visible_fields
  );

  if (!hasVisibleFields) {
    return true;
  }

  return transactions.some((transaction) => transaction.visible_fields?.[field]);
}

export function TransactionsTable({
  transactions,
  imports,
}: TransactionsTableProps) {
  const showDate = shouldShowField(transactions, "date");
  const showCategory = shouldShowField(transactions, "category");
  const showClient = shouldShowField(transactions, "client");
  const showDescription = shouldShowField(transactions, "description");
  const showStatus = shouldShowField(transactions, "status");

  const groupedTransactions = imports.slice(0, 2).map((importItem) => ({
    importItem,
    transactions: transactions.filter(
      (transaction) => transaction.import_id === importItem.id
    ),
  }));

  return (
    <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
            Transações recentes
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Últimos registros importados da planilha.
          </p>
        </div>

        <Link
          href="/transacoes"
          className="rounded-xl border border-slate-200 px-4 py-2 text-center text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Ver todos
        </Link>
      </div>

      <div className="mt-6 space-y-6">
        {groupedTransactions.map((group) => (
          <div
            key={group.importItem.id}
            className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950"
          >
            <div className="mb-4">
              <h4 className="font-semibold text-slate-950 dark:text-white">
                {group.importItem.file_name}
              </h4>

              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                {group.importItem.total_records} registros •{" "}
                {formatCurrency(Number(group.importItem.total_amount))} •{" "}
                {new Date(group.importItem.created_at).toLocaleDateString(
                  "pt-BR"
                )}
              </p>
            </div>

            <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <tr>
                    {showClient && (
                      <th className="whitespace-nowrap pb-3 pr-6 font-medium">
                        Cliente
                      </th>
                    )}

                    {showCategory && (
                      <th className="whitespace-nowrap pb-3 pr-6 font-medium">
                        Categoria
                      </th>
                    )}

                    {showDescription && (
                      <th className="whitespace-nowrap pb-3 pr-6 font-medium">
                        Descrição
                      </th>
                    )}

                    <th className="whitespace-nowrap pb-3 pr-6 font-medium">
                      Tipo
                    </th>

                    {showStatus && (
                      <th className="whitespace-nowrap pb-3 pr-6 font-medium">
                        Status
                      </th>
                    )}

                    <th className="whitespace-nowrap pb-3 pr-6 font-medium">
                      Valor
                    </th>

                    {showDate && (
                      <th className="whitespace-nowrap pb-3 font-medium">
                        Data
                      </th>
                    )}
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {group.transactions.map((transaction, index) => (
                    <tr
                      key={`${transaction.client}-${transaction.date}-${index}`}
                    >
                      {showClient && (
                        <td className="whitespace-nowrap py-4 pr-6 font-medium text-slate-950 dark:text-white">
                          {transaction.client}
                        </td>
                      )}

                      {showCategory && (
                        <td className="whitespace-nowrap py-4 pr-6 text-slate-600 dark:text-slate-300">
                          {transaction.category}
                        </td>
                      )}

                      {showDescription && (
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

                      {showStatus && (
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

                      <td className="whitespace-nowrap py-4 pr-6 text-slate-600 dark:text-slate-300">
                        {formatCurrency(transaction.amount)}
                      </td>

                      {showDate && (
                        <td className="whitespace-nowrap py-4 text-slate-500 dark:text-slate-400">
                          {transaction.date}
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}