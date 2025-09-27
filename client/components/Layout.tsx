import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { Crown } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="min-h-screen">
          <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-4 text-foreground md:hidden">
            <MobileNav />
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-base font-semibold">
              daemon
            </div>
            <button
              aria-label="Premium"
              className="inline-flex items-center justify-center rounded-2xl bg-muted p-4 text-foreground shadow-lg"
            >
              <Crown className="size-5 text-orange-400" />
            </button>
          </header>
          {children}
        </main>
      </div>
    </div>
  );
}
