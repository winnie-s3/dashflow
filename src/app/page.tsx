const features = [
  {
    title: "Upload de planilhas",
    text: "Importe arquivos CSV com dados financeiros ou operacionais para transformar registros manuais em informações mais organizadas.",
  },
  {
    title: "Dashboard financeiro",
    text: "Visualize receitas, despesas, saldo estimado, valores pendentes, gráficos e tabela de transações em uma interface única.",
  },
  {
    title: "Relatórios automáticos",
    text: "Gere uma visão executiva dos dados importados, com resumo do período, pontos de atenção e próximos passos.",
  },
];

const steps = [
  {
    title: "Crie uma conta",
    text: "Acesse o DashFlow com login seguro e mantenha seus dados separados por usuário.",
  },
  {
    title: "Importe um CSV",
    text: "Envie uma planilha com os dados que deseja visualizar. O sistema valida as informações antes da importação.",
  },
  {
    title: "Acompanhe os indicadores",
    text: "Depois da importação, o dashboard organiza os dados em cards, gráficos, tabela e relatório automático.",
  },
];

const stack = ["Next.js", "TypeScript", "Tailwind CSS", "Supabase", "PostgreSQL", "Recharts"];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.18),transparent_34%)]" />
      <div className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full bg-cyan-400/10 blur-3xl" />

      <section className="relative mx-auto max-w-7xl px-6 py-8">
        <header className="flex items-center justify-between gap-4">
          <a href="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-cyan-400 text-sm font-black text-slate-950">
              DF
            </div>

            <div>
              <p className="text-sm font-bold text-white">DashFlow</p>
              <p className="text-xs text-slate-500">Dashboard empresarial</p>
            </div>
          </a>

          <nav className="hidden items-center gap-6 text-sm text-slate-400 md:flex">
            <a href="#funcionalidades" className="hover:text-white">
              Funcionalidades
            </a>
            <a href="#como-usar" className="hover:text-white">
              Como usar
            </a>
            <a href="#projeto" className="hover:text-white">
              Projeto
            </a>
          </nav>

          <a
            href="/login"
            className="rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-cyan-400/40 hover:bg-slate-800"
          >
            Acessar demo
          </a>
        </header>

        <section className="flex min-h-[calc(100vh-72px)] flex-col items-center justify-center py-20 text-center">
          <div className="mb-6 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-300 backdrop-blur-sm">
            MVP SaaS • Dashboards • Relatórios automáticos
          </div>

          <h1 className="max-w-5xl text-4xl font-black tracking-tight text-white sm:text-5xl md:text-7xl">
            Transforme planilhas manuais em dashboards modernos para pequenas
            empresas.
          </h1>

          <p className="mt-8 max-w-3xl text-base leading-8 text-slate-400 sm:text-lg md:text-xl">
            O DashFlow organiza dados financeiros e operacionais em métricas,
            gráficos e relatórios automáticos para reduzir retrabalho e facilitar
            a visualização do negócio.
          </p>

          <div className="mt-12 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row">
            <a
              href="/login"
              className="rounded-2xl bg-cyan-400 px-8 py-4 text-lg font-semibold text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.25)] transition hover:scale-[1.02] hover:bg-cyan-300"
            >
              Testar demonstração
            </a>

            <a
              href="#como-usar"
              className="rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-lg font-semibold text-slate-200 backdrop-blur-sm transition hover:border-slate-500 hover:bg-slate-800"
            >
              Ver como funciona
            </a>
          </div>

          <div className="mt-20 w-full rounded-3xl border border-slate-800 bg-slate-900/50 p-3 shadow-2xl shadow-cyan-950/20 backdrop-blur-sm">
            <img
              src="/screenshots/dashboard-overview-dark.png"
              alt="Dashboard do DashFlow"
              className="w-full rounded-2xl border border-slate-800"
            />
          </div>
        </section>
      </section>

      <section
        id="funcionalidades"
        className="relative mx-auto max-w-7xl px-6 py-24"
      >
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-cyan-300">Funcionalidades</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Uma base completa para transformar dados em visualização.
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 md:text-base">
            O projeto foi pensado para simular uma solução empresarial real:
            autenticação, importação de dados, persistência, gráficos e
            relatórios em um fluxo único.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900"
            >
              <h3 className="text-xl font-semibold text-white">
                {feature.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                {feature.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-300">Upload CSV</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Importe dados e visualize uma prévia antes de salvar.
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 md:text-base">
            A etapa de upload valida o arquivo, mostra os registros encontrados
            e permite confirmar a importação antes de enviar os dados para o
            banco.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-3 shadow-2xl shadow-cyan-950/20">
          <img
            src="/screenshots/upload-preview.png"
            alt="Tela de upload CSV do DashFlow"
            className="w-full rounded-2xl border border-slate-800"
          />
        </div>
      </section>

      <section
        id="como-usar"
        className="relative mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-medium text-cyan-300">Como usar</p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Um fluxo simples para sair da planilha e chegar no dashboard.
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-lg font-bold text-cyan-300">
                {index + 1}
              </div>

              <h3 className="text-xl font-semibold text-white">
                {step.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative mx-auto grid max-w-7xl gap-8 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-3 shadow-2xl shadow-cyan-950/20 lg:order-1">
          <img
            src="/screenshots/reports.png"
            alt="Tela de relatórios automáticos"
            className="w-full rounded-2xl border border-slate-800"
          />
        </div>

        <div className="lg:order-2">
          <p className="text-sm font-medium text-cyan-300">
            Relatórios automáticos
          </p>

          <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
            Gere uma análise rápida a partir dos dados importados.
          </h2>

          <p className="mt-5 text-sm leading-7 text-slate-400 md:text-base">
            Além dos gráficos, o DashFlow também apresenta um resumo executivo
            com informações sobre receitas, despesas, pendências e saldo
            estimado.
          </p>
        </div>
      </section>

      <section
        id="projeto"
        className="relative mx-auto max-w-7xl px-6 py-24"
      >
        <div className="rounded-3xl border border-slate-800 bg-slate-900/60 p-8 md:p-10">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-cyan-300">Projeto</p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-white md:text-5xl">
                Construído como MVP funcional de dashboard empresarial.
              </h2>

              <p className="mt-5 text-sm leading-7 text-slate-400 md:text-base">
                O objetivo do projeto é demonstrar um fluxo completo de produto:
                autenticação, importação de planilhas, armazenamento dos dados,
                dashboard, relatórios e deploy.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Stack
              </h3>

              <div className="mt-5 flex flex-wrap gap-3">
                {stack.map((item) => (
                  <span
                    key={item}
                    className="rounded-full border border-slate-700 bg-slate-950 px-4 py-2 text-sm text-slate-300"
                  >
                    {item}
                  </span>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                <a
                  href="https://github.com/winnie-s3/dashflow"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl bg-white px-6 py-3 text-center font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Ver GitHub
                </a>

                <a
                  href="https://www.linkedin.com/in/winnie-silva"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-2xl border border-slate-700 px-6 py-3 text-center font-semibold text-slate-200 transition hover:bg-slate-800"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative border-t border-slate-800 px-6 py-8 text-center text-sm text-slate-500">
        Desenvolvido por Winnie Silva • DashFlow
      </footer>
    </main>
  );
}