import { Transaction } from "@/types/transaction";
import { formatCurrency } from "@/lib/dashboardCalculations";

type TransactionsTableProps = {
  transactions: Transaction[];
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">
            Transações recentes
          </h3>

          <p className="mt-1 text-sm text-slate-400">
            Últimos registros importados da planilha.
          </p>
        </div>

        <button className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800">
          Ver todos
        </button>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-slate-800 text-slate-400">
            <tr>
              <th className="pb-3 font-medium">Cliente</th>
              <th className="pb-3 font-medium">Categoria</th>
              <th className="pb-3 font-medium">Tipo</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Valor</th>
              <th className="pb-3 font-medium">Data</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800">
            {transactions.map((transaction, index) => (
              <tr key={`${transaction.client}-${transaction.date}-${index}`}>
                <td className="py-4 text-white">{transaction.client}</td>

                <td className="py-4 text-slate-300">
                  {transaction.category}
                </td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      transaction.type === "receita"
                        ? "bg-cyan-400/10 text-cyan-300"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {transaction.type}
                  </span>
                </td>

                <td className="py-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      transaction.status === "pago"
                        ? "bg-emerald-400/10 text-emerald-300"
                        : "bg-amber-400/10 text-amber-300"
                    }`}
                  >
                    {transaction.status}
                  </span>
                </td>

                <td className="py-4 text-slate-300">
                  {formatCurrency(transaction.amount)}
                </td>

                <td className="py-4 text-slate-400">{transaction.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}