import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [product, setProduct] = useState(true);

  return (
      <div className="min-h-screen bg-gradient-to-b from-indigo-900/40 to-indigo-900/10 p-6 md:p-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-white/10 bg-[rgba(8,15,26,0.65)] p-6 shadow-2xl backdrop-blur md:p-8">
          <h1 className="text-3xl font-semibold text-white">Settings</h1>

          <section className="mt-6">
            <h2 className="mb-3 text-base font-semibold text-white">Theme</h2>
            <RadioGroup
              value={theme}
              onValueChange={(v) => setTheme(v as any)}
              className="flex items-center gap-6 text-sm text-white/90"
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="system" id="theme-system" />
                <Label htmlFor="theme-system" className="text-white/90">System</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="light" id="theme-light" />
                <Label htmlFor="theme-light" className="text-white/90">Light</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <Label htmlFor="theme-dark" className="text-white/90">Dark</Label>
              </div>
            </RadioGroup>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 text-base font-semibold text-white">Notifications</h2>
            <div className="space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Checkbox id="email" checked={email} onCheckedChange={(v) => setEmail(Boolean(v))} />
                <Label htmlFor="email" className="text-white/90">Email notifications</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="push" checked={push} onCheckedChange={(v) => setPush(Boolean(v))} />
                <Label htmlFor="push" className="text-white/90">Push notifications</Label>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox id="product" checked={product} onCheckedChange={(v) => setProduct(Boolean(v))} />
                <Label htmlFor="product" className="text-white/90">Product updates</Label>
              </div>
            </div>
          </section>

          <section className="mt-8">
            <h2 className="mb-3 text-base font-semibold text-white">Account</h2>
            <Button
              variant="destructive"
              className="mt-2 h-10 rounded-lg px-4"
              onClick={() => {
                try { window.solana?.disconnect?.(); } catch {}
                localStorage.removeItem("daemon_token");
                localStorage.removeItem("wallet_address");
                location.href = "/login";
              }}
            >
              Log Out
            </Button>
          </section>

          <section className="mt-10">
            <h2 className="text-base font-semibold text-white">More Settings</h2>
            <p className="mt-1 text-sm text-white/60">Additional preferences and integrations coming soon.</p>
          </section>
        </div>
      </div>
  );
}
