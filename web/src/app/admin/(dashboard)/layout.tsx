import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AuthSessionProvider } from "@/components/providers/AuthSessionProvider";

export const metadata = { title: "Admin | IMT Engineers" };

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <AuthSessionProvider>
      <div className="flex min-h-screen bg-slate-100 font-sans">
        <AdminSidebar userEmail={session.user.email ?? ""} />
        <div className="flex min-h-screen flex-1 flex-col">{children}</div>
      </div>
    </AuthSessionProvider>
  );
}
