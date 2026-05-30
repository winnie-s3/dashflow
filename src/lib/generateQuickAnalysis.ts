import { Transaction } from "@/types/transaction";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function generateQuickAnalysis(transactions: Transaction[]): string {
  if (transactions.length === 0) {
    return "Nenhum dado foi importado ainda.";
  }

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

  if (totalExpenses === 0) {
    return `Os dados importados somam ${formatCurrency(
      totalRevenue
    )} em receitas. Nenhuma despesa foi identificada nos registros atuais. Se o arquivo possuir despesas, confira se a coluna de categoria ou descrição foi mapeada corretamente.`;
  }

  if (pendingAmount > 0) {
    return `Os dados importados indicam ${formatCurrency(
      totalRevenue
    )} em receitas e ${formatCurrency(
      totalExpenses
    )} em despesas, resultando em um lucro estimado de ${formatCurrency(
      profit
    )}. Também existem ${formatCurrency(
      pendingAmount
    )} em valores pendentes, que merecem atenção no fluxo de caixa.`;
  }

  return `Os dados importados indicam ${formatCurrency(
    totalRevenue
  )} em receitas e ${formatCurrency(
    totalExpenses
  )} em despesas, resultando em um lucro estimado de ${formatCurrency(
    profit
  )}. Não foram encontrados valores pendentes nos registros atuais.`;
}