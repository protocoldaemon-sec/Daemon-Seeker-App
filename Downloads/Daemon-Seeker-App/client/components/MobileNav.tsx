import { useEffect, useState } from "react";
import { Menu, History, Settings, MessageSquare, HelpCircle, LogOut, User } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export default function MobileNav() {
  const [wallet, setWallet] = useState<string | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    setWallet(localStorage.getItem("wallet_address"));
  }, []);

  return (
    <div className="flex items-center">
      <Sheet>
        <SheetTrigger asChild>
          <button aria-label="Open menu" className="inline-flex items-center justify-center rounded-2xl bg-[#2b3138] p-4 text-white shadow-lg">
            <Menu className="size-5" />
          </button>
        </SheetTrigger>
        <SheetContent side="left" aria-label="Main menu" className="w-[85%] max-w-sm bg-[#0f1316] text-white p-0">
          <div className="flex h-full flex-col">
            <div className="px-6 pt-10 pb-6">
              <div className="mx-auto mb-4 grid size-24 place-items-center rounded-full bg-white/5">
                <User className="size-10 text-white/80" />
              </div>
              <div className="mx-auto w-full max-w-xs rounded-full bg-white/10 px-4 py-2 text-center text-sm font-medium">
                {wallet ?? "wallet_address"}
              </div>
            </div>
            <div className="h-px w-full bg-white/10" />
            <nav className="flex flex-1 flex-col gap-2 px-6 py-6 text-sm">
              <NavItem to="/home" icon={<History className="size-5" />}>History</NavItem>
              <NavItem to="/settings" icon={<Settings className="size-5" />}>Settings</NavItem>
              <NavItem to="/chat" icon={<MessageSquare className="size-5" />}>Ai Copilot</NavItem>
              <NavItem to="/faq" icon={<HelpCircle className="size-5" />}>FAQ</NavItem>
            </nav>
            <div className="px-6 pb-8">
              <SheetClose asChild>
                <Button
                  onClick={async () => {
                    try {
                      await window.solana?.disconnect?.();
                    } catch {}
                    localStorage.removeItem("daemon_token");
                    localStorage.removeItem("wallet_address");
                    navigate("/login", { replace: true });
                  }}
                  className="h-12 w-full rounded-xl bg-indigo-500 text-white hover:bg-indigo-500/90"
                >
                  <LogOut className="mr-2" /> Disconnect Wallet
                </Button>
              </SheetClose>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function NavItem({ to, icon, children }: { to: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <SheetClose asChild>
      <Link to={to} className="flex items-center gap-3 rounded-lg px-2 py-3 text-white/90 hover:bg-white/5">
        {icon}
        <span>{children}</span>
      </Link>
    </SheetClose>
  );
}
