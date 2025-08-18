import { AdminDashboardLayout } from "./_components/admin-dashboard-layout";
import { AdminNavbar } from "./_components/admin-navbar";

export default function AdminDashboardPage() {
  return (
    <div>
      <main className="w-[70%] mx-auto py-4">
        <AdminDashboardLayout />
      </main>
    </div>
  );
}