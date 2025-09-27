import { useState } from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [email, setEmail] = useState(true);
  const [push, setPush] = useState(false);
  const [product, setProduct] = useState(true);

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-md px-4 py-6">
        <h1 className="mb-4 text-2xl font-semibold">Settings</h1>

        {/* Theme section */}
        <div className="overflow-hidden rounded-2xl border bg-card text-foreground">
          <div className="border-b px-4 py-3 text-sm font-medium">Theme</div>
          <div className="px-4 py-3">
            <RadioGroup
              value={theme}
              onValueChange={(v) => setTheme(v as any)}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center gap-2">
                <RadioGroupItem value="system" id="theme-system" />
                <span>System</span>
              </label>
              <label className="flex items-center gap-2">
                <RadioGroupItem value="light" id="theme-light" />
                <span>Light</span>
              </label>
              <label className="flex items-center gap-2">
                <RadioGroupItem value="dark" id="theme-dark" />
                <span>Dark</span>
              </label>
            </RadioGroup>
          </div>
        </div>

        {/* Notifications */}
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card">
          <div className="border-b px-4 py-3 text-sm font-medium">
            Notifications
          </div>
          <div className="divide-y">
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-sm">Email notifications</div>
              <Switch checked={email} onCheckedChange={setEmail} />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-sm">Push notifications</div>
              <Switch checked={push} onCheckedChange={setPush} />
            </div>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="text-sm">Product updates</div>
              <Switch checked={product} onCheckedChange={setProduct} />
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card">
          <div className="border-b px-4 py-3 text-sm font-medium">Account</div>
          <div className="px-4 py-4">
            <Button
              variant="destructive"
              className="h-11 w-full rounded-xl"
              onClick={() => {
                try {
                  window.solana?.disconnect?.();
                } catch {}
                localStorage.removeItem("daemon_token");
                localStorage.removeItem("wallet_address");
                location.href = "/login";
              }}
            >
              Log Out
            </Button>
          </div>
        </div>

        {/* More */}
        <div className="mt-4 overflow-hidden rounded-2xl border bg-card">
          <div className="px-4 py-3">
            <div className="text-sm font-medium">More Settings</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Additional preferences and integrations coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
