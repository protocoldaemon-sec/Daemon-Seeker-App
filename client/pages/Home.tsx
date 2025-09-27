import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import AuditButton from "@/components/AuditButton";
import { toast } from "sonner";
import { Crown } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="min-h-screen">
          <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-4 text-foreground md:hidden">
            <MobileNav />
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-base font-semibold">daemon</div>
            <button aria-label="Premium" className="inline-flex items-center justify-center rounded-2xl bg-[#2b3138] p-4 text-white shadow-lg">
              <Crown className="size-5 text-orange-400" />
            </button>
          </header>

          {/* Hero with animated Audit button */}
          <section className="relative grid place-items-center bg-[#0b0e11] px-6 py-16 text-white md:py-24">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/10 to-black/30" />
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 rounded-t-[48%] bg-[#121622]" />
            <AuditButton onClick={() => toast("Starting security audit…")} />
          </section>

        </main>
      </div>
    </div>
  );
}
