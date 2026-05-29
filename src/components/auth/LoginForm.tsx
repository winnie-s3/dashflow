"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export function LoginForm() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setMessage(null);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setMessage(error.message);
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setIsLoading(false);
      return;
    }

    setMessage("Conta criada com sucesso. Redirecionando para o dashboard...");
    router.push("/dashboard");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6 text-white">
      <section className="w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-8">
        <p className="text-sm font-medium text-cyan-300">DashFlow</p>

        <h1 className="mt-2 text-3xl font-bold">
          {isLogin ? "Entrar no painel" : "Criar sua conta"}
        </h1>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          {isLogin
            ? "Acesse sua conta para importar planilhas, visualizar dashboards e gerar relatórios."
            : "Crie uma conta para começar a usar o DashFlow e organizar suas planilhas em dashboards."}
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="text-sm text-slate-300">E-mail</label>

            <input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          <div>
            <label className="text-sm text-slate-300">Senha</label>

            <input
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-cyan-400"
            />
          </div>

          {message && (
            <div className="rounded-xl border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300">
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-xl bg-cyan-400 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isLoading ? "Carregando..." : isLogin ? "Entrar" : "Criar conta"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-slate-400">
          {isLogin ? (
            <>
              Ainda não tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setMessage(null);
                }}
                className="font-medium text-cyan-300 hover:text-cyan-200"
              >
                Criar conta
              </button>
            </>
          ) : (
            <>
              Já tem uma conta?{" "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setMessage(null);
                }}
                className="font-medium text-cyan-300 hover:text-cyan-200"
              >
                Entrar
              </button>
            </>
          )}
        </div>
      </section>
    </main>
  );
}