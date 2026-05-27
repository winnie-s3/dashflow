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
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 xl:col-span-2">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Receita x Despesa
        </h3>
        <p className="mt-1 text-sm text-slate-400">Comparativo mensal</p>
      </div>

      <div className="mt-8 h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />

            <XAxis
              dataKey="month"
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#94a3b8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `R$ ${Number(value) / 1000}k`}
            />

            <Tooltip
              formatter={(value) => currencyFormatter(Number(value))}
              contentStyle={{
                backgroundColor: "#020617",
                border: "1px solid #1e293b",
                borderRadius: "12px",
                color: "#fff",
              }}
              labelStyle={{
                color: "#e2e8f0",
              }}
            />

            <Bar dataKey="receita" fill="#22d3ee" radius={[8, 8, 0, 0]} />
            <Bar dataKey="despesa" fill="#475569" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}