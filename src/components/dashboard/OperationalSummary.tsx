export function OperationalSummary() {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
        Resumo operacional
      </h3>

      <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">
        A empresa apresentou crescimento de receita no período analisado,
        mantendo despesas sob controle. Valores pendentes devem ser acompanhados
        para evitar impacto no fluxo de caixa.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Receita</span>
            <span className="font-medium text-slate-950 dark:text-white">
              72%
            </span>
          </div>

          <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-2 w-[72%] rounded-full bg-slate-950 dark:bg-white" />
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm">
            <span className="text-slate-500 dark:text-slate-400">Despesas</span>
            <span className="font-medium text-slate-950 dark:text-white">
              43%
            </span>
          </div>

          <div className="mt-2 h-2 rounded-full bg-slate-100 dark:bg-slate-800">
            <div className="h-2 w-[43%] rounded-full bg-slate-400 dark:bg-slate-500" />
          </div>
        </div>
      </div>
    </div>
  );
}