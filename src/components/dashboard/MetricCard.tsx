type MetricCardProps = {
  title: string;
  value: string;
  description: string;
};

export function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-5">
      <p className="text-sm text-slate-400">{title}</p>

      <strong className="mt-3 block text-2xl text-white">{value}</strong>

      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}