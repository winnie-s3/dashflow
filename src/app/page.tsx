export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-950 dark:bg-slate-950 dark:text-slate-100">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-16 text-center">
        <div className="mb-6 rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-300">
          DashFlow • Dashboard e automação de relatórios
        </div>

        <h1 className="max-w-4xl text-4xl font-bold tracking-tight text-slate-950 dark:text-white md:text-6xl">
          Transforme planilhas manuais em dashboards claros para pequenas
          empresas.
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-400">
          O DashFlow organiza dados de vendas, financeiro e operação em métricas,
          gráficos e relatórios simples para reduzir retrabalho e facilitar
          decisões.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white shadow-sm transition hover:bg-blue-700"
          >
            Ver demonstração
          </a>

          <a
            href="#como-funciona"
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Como funciona
          </a>
        </div>

        <div
          id="como-funciona"
          className="mt-16 grid w-full gap-4 text-left md:grid-cols-3"
        >
          {[
            {
              title: "1. Envie uma planilha",
              text: "O usuário importa um CSV com dados de vendas, despesas, clientes ou operação.",
            },
            {
              title: "2. Veja os indicadores",
              text: "O sistema transforma os dados em cards, gráficos, tabela e filtros.",
            },
            {
              title: "3. Gere relatórios",
              text: "A empresa ganha uma visão mais clara do negócio sem depender de controles manuais.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
            >
              <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
                {item.title}
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-400">
                {item.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}