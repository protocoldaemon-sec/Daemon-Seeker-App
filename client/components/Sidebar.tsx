import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MessageSquare, Home } from "lucide-react";

export default function Sidebar() {
  return (
    <aside className="h-screen w-64 shrink-0 border-r bg-sidebar p-6 hidden md:flex md:flex-col">
      <div className="mb-8 flex items-center gap-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
        <span className="text-lg font-semibold">Daemon</span>
      </div>
      <nav className="space-y-1">
        <NavItem to="/home" icon={<Home className="size-4" />}>Home</NavItem>
        <NavItem to="/chat" icon={<MessageSquare className="size-4" />}>AI Copilot</NavItem>
      </nav>
      <div className="mt-auto text-xs text-muted-foreground">
        v0.1 • Poppins
      </div>
    </aside>
  );
}

function NavItem({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground"
            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
        )
      }
    >
      {icon}
      <span>{children}</span>
    </NavLink>
  );
}
