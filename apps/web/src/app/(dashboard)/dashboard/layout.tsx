import { DashboardNavbar } from "./_components/dashboard-navbar";

// Sample user data - in a real app, this would come from your auth system
const sampleUser = {
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: "",
  plan: "paid" as const
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar user={sampleUser} />
      <main className="w-[70%] mx-auto px-4 py-4">
        {children}
      </main>
    </div>
  );
}