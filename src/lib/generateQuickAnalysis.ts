import { Transaction } from "@/types/transaction";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function generateQuickAnalysis(
  transactions: Transaction[]
): string {
  if (transactions.length === 0) {
    return "Nenhum dado foi importado ainda.";
  }

  const totalRevenue = transactions
    .filter((item) => item.category.toLowerCase() === "vendas")
    .reduce((sum, item) => sum + item.amount, 0);

  const totalExpenses = transactions
    .filter((item) => item.category.toLowerCase() !== "vendas")
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingAmount = transactions
    .filter((item) => item.status.toLowerCase() === "pendente")
    .reduce((sum, item) => sum + item.amount, 0);

  const profit = totalRevenue - totalExpenses;

  if (totalRevenue === 0 && totalExpenses > 0) {
    return `Os dados importados mostram ${formatCurrency(
      totalExpenses
    )} em despesas operacionais no período analisado.`;
  }

  if (pendingAmount > 0) {
    return `Os dados importados indicam ${formatCurrency(
      totalRevenue
    )} em receitas e ${formatCurrency(
      totalExpenses
    )} em despesas, resultando em um saldo estimado de ${formatCurrency(
      profit
    )}. Atualmente existem ${formatCurrency(
      pendingAmount
    )} em valores pendentes registrados no sistema.`;
  }

  return `Os dados importados indicam ${formatCurrency(
    totalRevenue
  )} em receitas e ${formatCurrency(
    totalExpenses
  )} em despesas, resultando em um saldo estimado de ${formatCurrency(
    profit
  )}. Nenhum valor pendente foi encontrado nos registros atuais.`;
}