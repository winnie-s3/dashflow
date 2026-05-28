"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export function SettingsClient() {
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function loadUser() {
      const { data } = await supabase.auth.getUser();
      setEmail(data.user?.email ?? "");
    }

    loadUser();
  }, []);

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
          Configurações
        </p>

        <h1 className="mt-1 text-3xl font-bold text-slate-950 dark:text-white">
          Configurações da conta
        </h1>

        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          Informações básicas da conta conectada ao DashFlow.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
          Conta
        </h2>

        <div className="mt-6 max-w-xl space-y-4">
          <div>
            <label className="text-sm text-slate-600 dark:text-slate-400">
              E-mail
            </label>

            <input
              value={email}
              disabled
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
            />
          </div>

          <div>
            <label className="text-sm text-slate-600 dark:text-slate-400">
              Plano atual
            </label>

            <input
              value="Demo"
              disabled
              className="mt-2 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-700 outline-none dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300"
            />
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <h2 className="text-lg font-semibold text-slate-950 dark:text-white">
          Sobre a demo
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-400">
          Esta versão permite importar planilhas CSV, visualizar métricas,
          gráficos e relatórios automáticos com dados salvos no Supabase e
          vinculados ao usuário logado.
        </p>
      </section>
    </div>
  );
}