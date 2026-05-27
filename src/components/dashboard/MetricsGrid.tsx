import { MetricCard } from "./MetricCard";

type Metric = {
  title: string;
  value: string;
  description: string;
};

type MetricsGridProps = {
  metrics: Metric[];
};

export function MetricsGrid({ metrics }: MetricsGridProps) {
  return (
    <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {metrics.map((metric) => (
        <MetricCard
          key={metric.title}
          title={metric.title}
          value={metric.value}
          description={metric.description}
        />
      ))}
    </section>
  );
}