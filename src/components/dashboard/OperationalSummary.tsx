export function OperationalSummary() {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <h3 className="text-lg font-semibold text-white">Resumo operacional</h3>

      <p className="mt-2 text-sm leading-6 text-slate-400">
        A empresa apresentou crescimento de receita no período analisado,
        mantendo despesas abaixo de 50% do faturamento. Existem valores
        pendentes que podem impactar o fluxo de caixa.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Receita</span>
            <span className="text-white">72%</span>
          </div>

          <div className="mt-2 h-2 rounded-full bg-slate-800">
            <div className="h-2 w-[72%] rounded-full bg-cyan-400" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-400">Despesas</span>
            <span className="text-white">43%</span>
          </div>

          <div className="mt-2 h-2 rounded-full bg-slate-800">
            <div className="h-2 w-[43%] rounded-full bg-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
}