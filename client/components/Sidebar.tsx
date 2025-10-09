import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useGSAPStagger, useMagneticHover } from "@/hooks/useGSAP";
import {
  MessageSquare,
  Home,
  History,
  Settings,
  HelpCircle,
  Shield,
} from "lucide-react";
import DaemonLogo from "@/components/DaemonLogo";

export default function Sidebar() {
  const navRef = useGSAPStagger('.nav-item', 0.2);
  const logoRef = useMagneticHover(0.2);

  return (
    <aside className="h-screen w-64 shrink-0 border-r bg-sidebar/95 backdrop-blur-xl p-6 hidden md:flex md:flex-col fixed z-20">
      <motion.div 
        ref={logoRef}
        className="mb-8 flex items-center gap-2 cursor-pointer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <DaemonLogo size={32} className="text-white" />
        <span className="text-lg font-semibold">Daemon</span>
      </motion.div>
      <nav ref={navRef} className="space-y-1">
        <NavItem to="/home" icon={<Home className="size-4" />}>
          Home
        </NavItem>
        <NavItem to="/audit" icon={<Shield className="size-4" />}>
          Audit
        </NavItem>
        <NavItem to="/history" icon={<History className="size-4" />}>
          History
        </NavItem>
        <NavItem to="/chat" icon={<MessageSquare className="size-4" />}>
          AI Copilot
        </NavItem>
        <NavItem to="/settings" icon={<Settings className="size-4" />}>
          Settings
        </NavItem>
        <NavItem to="/faq" icon={<HelpCircle className="size-4" />}>
          FAQ
        </NavItem>
      </nav>
      <motion.div 
        className="mt-auto text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        v0.1 • Daemon Seeker App. <br/> Powered by Daemon Protocol
      </motion.div>
    </aside>
  );
}

function NavItem({
  to,
  icon,
  children,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        cn(
          "nav-item flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-300 border-l-2 relative overflow-hidden",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground border-primary shadow-sm font-semibold"
            : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-transparent",
        )
      }
    >
      {({ isActive }) => (
        <motion.div
          className="flex items-center gap-3 w-full relative z-10"
          whileHover={{ 
            x: 6,
            transition: { type: "spring", stiffness: 400, damping: 17 }
          }}
          whileTap={{ 
            scale: 0.95,
            transition: { duration: 0.1 }
          }}
        >
          <motion.div
            animate={{ 
              scale: isActive ? 1.15 : 1,
              rotate: isActive ? [0, 360] : 0,
            }}
            transition={{ 
              duration: isActive ? 0.6 : 0.3,
              ease: "easeOut"
            }}
          >
            {icon}
          </motion.div>
          <motion.span
            animate={{
              x: isActive ? 2 : 0,
            }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.span>
          
          {/* Animated background glow for active state */}
          {isActive && (
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-primary/10 to-primary/5 -z-10"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
            />
          )}
        </motion.div>
      )}
    </NavLink>
  );
}
