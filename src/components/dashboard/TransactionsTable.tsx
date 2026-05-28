import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/dashboardCalculations";

type TransactionsTableProps = {
  transactions: Transaction[];
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
            Transações recentes
          </h3>

          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Últimos registros importados da planilha.
          </p>
        </div>

        <button className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800">
          Ver todos
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-200 text-slate-500 dark:border-slate-800 dark:text-slate-400">
            <tr>
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Categoria</th>
              <th className="pb-3 font-medium">Tipo</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Valor</th>
              <th className="pb-3 font-medium">Data</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
            {transactions.map((transaction, index) => (
              <tr key={`${transaction.client}-${transaction.date}-${index}`}>
                <td className="py-4 font-medium text-slate-950 dark:text-white">
                  {transaction.client}
                </td>

                <td className="py-4 text-slate-600 dark:text-slate-300">
                  {transaction.category}
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
                  {formatCurrency(transaction.amount)}
                </td>

                <td className="py-4 text-slate-500 dark:text-slate-400">
                  {transaction.date}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}