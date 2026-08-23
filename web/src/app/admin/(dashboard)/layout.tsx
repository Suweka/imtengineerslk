import { AdminSidebar } from "@/components/admin/AdminSidebar";

export const metadata = { title: "Admin | IMT Engineers" };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">
      <AdminSidebar />
      <div className="flex min-h-screen flex-1 flex-col">{children}</div>
    </div>
  );
}
