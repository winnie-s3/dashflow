"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

type CategoryData = {
  name: string;
  value: number;
};

type CategoryChartProps = {
  data: CategoryData[];
};

const COLORS = ["#22d3ee", "#38bdf8", "#64748b", "#94a3b8"];

const currencyFormatter = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);
};

export function CategoryChart({ data }: CategoryChartProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
      <div>
        <h3 className="text-lg font-semibold text-white">
          Valores por categoria
        </h3>

        <p className="mt-1 text-sm text-slate-400">
          Distribuição dos dados importados
        </p>
      </div>

      <div className="mt-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={90}
              paddingAngle={4}
            >
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>

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
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 space-y-3">
        {data.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center justify-between text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />

              <span className="text-slate-300">{item.name}</span>
            </div>

            <span className="font-medium text-white">
              {currencyFormatter(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}