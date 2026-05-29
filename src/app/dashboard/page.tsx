import { AppLayout } from "@/components/dashboard/AppLayout";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default function DashboardPage() {
  return (
    <AppLayout>
      <DashboardClient />
    </AppLayout>
  );
}