"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type RevenueExpenseData = {
  month: string;
  receita: number;
  despesa: number;
};

type RevenueExpenseChartProps = {
  data: RevenueExpenseData[];
};

const currencyFormatter = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
};

export function RevenueExpenseChart({ data }: RevenueExpenseChartProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 xl:col-span-2">
      <div>
        <h3 className="text-lg font-semibold text-slate-950 dark:text-white">
          Receita x Despesa
        </h3>

        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
          Comparativo mensal
        </p>
      </div>

      <div className="mt-6 h-64 min-w-0 overflow-hidden sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 8, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />

            <XAxis
              dataKey="month"
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#64748b"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${Number(value) / 1000}k`}
            />

            <Tooltip
              formatter={(value) => currencyFormatter(Number(value))}
              contentStyle={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "12px",
                color: "#0f172a",
              }}
              labelStyle={{ color: "#0f172a" }}
            />

            <Bar dataKey="receita" fill="#2563eb" radius={[8, 8, 0, 0]} />
            <Bar dataKey="despesa" fill="#f97316" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex gap-4 text-sm">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="h-3 w-3 rounded-full bg-blue-600" />
          Receita
        </div>

        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
          <span className="h-3 w-3 rounded-full bg-orange-500" />
          Despesa
        </div>
      </div>
    </div>
  );
}