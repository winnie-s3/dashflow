type MetricCardProps = {
  title: string;
  value: string;
  description: string;
};

export function MetricCard({ title, value, description }: MetricCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md dark:border-slate-800 dark:bg-slate-900 sm:p-5">
      <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
        {title}
      </p>

      <strong className="mt-3 block text-2xl font-bold text-slate-950 dark:text-white sm:text-2xl">
        {value}
      </strong>

      <p className="mt-2 text-sm text-slate-500 dark:text-slate-500">
        {description}
      </p>
    </div>
  );
}