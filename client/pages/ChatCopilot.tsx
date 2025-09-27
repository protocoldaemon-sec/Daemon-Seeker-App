import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import { useEffect } from "react";

interface Msg { id: string; role: "user" | "assistant"; content: string }

export default function ChatCopilot() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "1", role: "assistant", content: "Hi! I’m your AI Copilot. How can I help?" },
  ]);
  const [input, setInput] = useState("");
  const [prompts, setPrompts] = useState<{ id?: string; name?: string; title?: string; content?: string }[]>([]);
  const [selectedPrompt, setSelectedPrompt] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/agent/system-prompts");
        if (!r.ok) return;
        const data = await r.json();
        const arr = Array.isArray(data) ? data : (data?.prompts || []);
        setPrompts(arr);
      } catch {}
    })();
  }, []);

  const send = async () => {
    if (!input.trim() || loading) return;
    const user: Msg = { id: crypto.randomUUID(), role: "user", content: input };
    setMessages((m) => [...m, user]);
    setInput("");
    setLoading(true);
    try {
      const r = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: user.content, systemPromptId: selectedPrompt }),
      });
      const ct = r.headers.get("content-type") || "";
      if (ct.includes("application/json")) {
        const data = await r.json();
        const text = data?.reply || data?.message || JSON.stringify(data);
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: String(text) }]);
      } else {
        const text = await r.text();
        setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: text }]);
      }
    } catch (e) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-10 border-b bg-background/70 backdrop-blur">
            <div className="flex items-center justify-between px-4 py-3 md:hidden">
              <MobileNav />
              <div className="pointer-events-none absolute left-1/2 -translate-x-1/2">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-fuchsia-500" />
              </div>
              <div className="w-10" />
            </div>
            <div className="hidden px-6 py-4 md:block">
              <h1 className="text-lg font-semibold">AI Copilot</h1>
              <p className="text-xs text-muted-foreground">Chat privately with your assistant</p>
            </div>
          </header>
          <div className="flex items-center gap-2 border-b bg-muted/20 px-6 py-3 text-xs">
            <select
              value={selectedPrompt || ""}
              onChange={(e) => setSelectedPrompt(e.target.value || undefined)}
              className="w-64 rounded-md border bg-background px-2 py-1"
            >
              <option value="">Default system prompt</option>
              {prompts.map((p) => (
                <option key={p.id || p.name || p.title} value={String(p.id || p.name || "")}>
                  {p.title || p.name || p.id}
                </option>
              ))}
            </select>
            {loading && <span className="text-muted-foreground">Sending…</span>}
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-6">
            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={
                  m.role === "user"
                    ? "inline-block max-w-[80%] rounded-2xl bg-primary px-4 py-2 text-primary-foreground"
                    : "inline-block max-w-[80%] rounded-2xl bg-muted px-4 py-2"
                }>
                  {m.content}
                </div>
              </div>
            ))}
          </div>
          <div className="border-t p-4">
            <div className="mx-auto flex max-w-3xl items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask something..."
                className="flex-1 rounded-full border bg-background px-4 py-2 outline-none focus:ring-2 focus:ring-ring"
              />
              <Button onClick={send} disabled={loading}>Send</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
