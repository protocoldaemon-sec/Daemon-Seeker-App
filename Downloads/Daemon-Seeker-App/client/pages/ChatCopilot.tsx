import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";

interface Msg { id: string; role: "user" | "assistant"; content: string }

export default function ChatCopilot() {
  const [messages, setMessages] = useState<Msg[]>([
    { id: "1", role: "assistant", content: "Hi! I’m your AI Copilot. How can I help?" },
  ]);
  const [input, setInput] = useState("");

  const send = async () => {
    if (!input.trim()) return;
    const user: Msg = { id: crypto.randomUUID(), role: "user", content: input };
    setMessages((m) => [...m, user]);
    setInput("");
    setTimeout(() => {
      const reply: Msg = { id: crypto.randomUUID(), role: "assistant", content: "Acknowledged. (Demo reply)" };
      setMessages((m) => [...m, reply]);
    }, 400);
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
              <Button onClick={send}>Send</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
