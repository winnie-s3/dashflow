import { Transaction } from "@/types/transaction";

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function calculateDashboardMetrics(transactions: Transaction[]) {
  const totalRevenue = transactions
    .filter((transaction) => transaction.type === "receita")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const totalExpenses = transactions
    .filter((transaction) => transaction.type === "despesa")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  const estimatedProfit = totalRevenue - totalExpenses;

  const pendingAmount = transactions
    .filter((transaction) => transaction.status === "pendente")
    .reduce((sum, transaction) => sum + transaction.amount, 0);

  return [
    {
      title: "Receita total",
      value: formatCurrency(totalRevenue),
      description: `${transactions.length} registros importados`,
    },
    {
      title: "Despesas",
      value: formatCurrency(totalExpenses),
      description: "Total classificado como despesa",
    },
    {
      title: "Lucro estimado",
      value: formatCurrency(estimatedProfit),
      description: "Receita menos despesas",
    },
    {
      title: "Valores pendentes",
      value: formatCurrency(pendingAmount),
      description: "Pagamentos ainda em aberto",
    },
  ];
}

export function groupByCategory(transactions: Transaction[]) {
  const grouped = transactions.reduce<Record<string, number>>(
    (acc, transaction) => {
      const category = transaction.category || "Sem categoria";

      acc[category] = (acc[category] ?? 0) + transaction.amount;

      return acc;
    },
    {}
  );

  return Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));
}

export function groupRevenueAndExpensesByMonth(transactions: Transaction[]) {
  const grouped = transactions.reduce<
    Record<string, { month: string; receita: number; despesa: number }>
  >((acc, transaction) => {
    const date = new Date(transaction.date);
    const month = date.toLocaleDateString("pt-BR", {
      month: "short",
    });

    if (!acc[month]) {
      acc[month] = {
        month,
        receita: 0,
        despesa: 0,
      };
    }

    acc[month][transaction.type] += transaction.amount;

    return acc;
  }, {});

  return Object.values(grouped);
}