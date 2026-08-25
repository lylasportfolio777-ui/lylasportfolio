import { logout } from "@/app/login/actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-panel min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      {children}
    </div>
  );
}
