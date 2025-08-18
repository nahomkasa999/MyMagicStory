import { AdminNavbar } from "./_components/admin-navbar";

interface AdminDashboardLayoutProps {
  children: React.ReactNode;
}

const AdminDashboardLayout = ({ children }: AdminDashboardLayoutProps) => {
  const sampleUser = {
    name: "Admin User",
    email: "admin@example.com",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <AdminNavbar user={sampleUser} />
      <main className="flex-grow container mx-auto px-3 sm:px-4 lg:px-6 py-4">
        {children}
      </main>
    </div>
  );
};

export default AdminDashboardLayout;