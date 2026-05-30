import { AppLayout } from "@/components/dashboard/AppLayout";
import { TransactionsPageClient } from "@/components/dashboard/TransactionsPageClient";

export default function TransactionsPage() {
  return (
    <AppLayout>
      <TransactionsPageClient />
    </AppLayout>
  );
}