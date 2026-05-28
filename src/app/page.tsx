export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 rounded-full border border-cyan-400/30 bg-cyan-400/10 px-4 py-2 text-sm text-cyan-300">
          DashFlow • Dashboard e automação de relatórios
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight md:text-6xl">
          Transforme planilhas manuais em dashboards claros para pequenas empresas.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
          O DashFlow organiza dados de vendas, financeiro e operação em métricas,
          gráficos e relatórios simples para reduzir retrabalho e facilitar decisões.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Ver demonstração
          </a>

          <a
            href="#como-funciona"
            className="rounded-xl border border-slate-700 px-6 py-3 font-semibold text-slate-200 transition hover:bg-slate-900"
          >
            Como funciona
          </a>
        </div>

        <div
          id="como-funciona"
          className="mt-16 grid w-full gap-4 text-left md:grid-cols-3"
        >
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">
              1. Envie uma planilha
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              O usuário importa um CSV com dados de vendas, despesas, clientes
              ou operação.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">
              2. Veja os indicadores
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              O sistema transforma os dados em cards, gráficos, tabela e filtros.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-lg font-semibold text-white">
              3. Gere relatórios
            </h2>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              A empresa ganha uma visão mais clara do negócio sem depender de
              controles manuais.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}