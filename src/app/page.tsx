export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#020617] text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_35%)]" />

      <section className="relative mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-20 text-center">
        <div className="mb-6 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-5 py-2 text-sm font-medium text-cyan-300 backdrop-blur-sm">
          DashFlow • Dashboard e automação de relatórios
        </div>

        <h1 className="max-w-5xl text-5xl font-black tracking-tight text-white md:text-7xl">
          Transforme planilhas manuais em dashboards modernos para pequenas
          empresas.
        </h1>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-slate-400 md:text-xl">
          Organize dados financeiros e operacionais em gráficos, métricas e
          relatórios automáticos sem depender de controles manuais no Excel.
        </p>

        <div className="mt-12 flex flex-col gap-4 sm:flex-row">
          <a
            href="/dashboard"
            className="rounded-2xl bg-cyan-400 px-8 py-4 text-lg font-semibold text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.25)] transition hover:scale-[1.02] hover:bg-cyan-300"
          >
            Ver demonstração
          </a>

          <a
            href="#como-funciona"
            className="rounded-2xl border border-slate-700 bg-slate-900/60 px-8 py-4 text-lg font-semibold text-slate-200 backdrop-blur-sm transition hover:border-slate-500 hover:bg-slate-800"
          >
            Como funciona
          </a>
        </div>

        <div className="mt-20 grid w-full gap-6 text-left md:grid-cols-3">
          {[
            {
              title: "1. Envie uma planilha",
              text: "Importe um CSV com dados financeiros, operacionais ou comerciais em segundos.",
            },
            {
              title: "2. Visualize indicadores",
              text: "O sistema organiza automaticamente métricas, gráficos e tabelas.",
            },
            {
              title: "3. Gere relatórios",
              text: "Tenha uma visão clara do negócio sem depender de controles manuais.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="group rounded-3xl border border-slate-800 bg-slate-900/60 p-8 backdrop-blur-sm transition hover:-translate-y-1 hover:border-cyan-400/30 hover:bg-slate-900"
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-300">
                <span className="text-lg font-bold">
                  {item.title.split(".")[0]}
                </span>
              </div>

              <h2 className="text-xl font-semibold text-white">
                {item.title.replace(/^\d+\.\s*/, "")}
              </h2>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                {item.text}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-24 grid w-full gap-6 md:grid-cols-3">
          {[
            "Upload CSV",
            "Dashboard em tempo real",
            "Relatórios automáticos",
          ].map((item) => (
            <div
              key={item}
              className="rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-5 text-sm font-medium text-slate-300 backdrop-blur-sm"
            >
              {item}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}