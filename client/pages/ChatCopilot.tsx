import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import MobileNav from "@/components/MobileNav";
import { useEffect } from "react";
import { CheckCircle2, MessageSquare } from "lucide-react";

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

  const insert = (t: string) => setInput(t);

  const extractAddress = (text: string): string | null => {
    const jsonAddr = /"address"\s*:\s*"([^"]+)"/i.exec(text);
    if (jsonAddr && jsonAddr[1]) return jsonAddr[1];
    const eth = /(0x[a-fA-F0-9]{40})\b/.exec(text);
    if (eth && eth[1]) return eth[1];
    const base58 = /\b[1-9A-HJ-NP-Za-km-z]{32,44}\b/.exec(text);
    if (base58 && base58[0]) return base58[0];
    return null;
  };

  const streamIntoMessage = async (res: Response, msgId: string): Promise<string> => {
    const reader = res.body?.getReader();
    if (!reader) return "";
    const decoder = new TextDecoder();
    const isSSE = (res.headers.get("content-type") || "").includes("text/event-stream");
    let full = "";

    if (!isSSE) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, content: (m.content || "") + chunk } : m)));
      }
      return full;
    }

    let buffer = "";
    outer: while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let idx;
      while ((idx = buffer.indexOf("\n\n")) !== -1) {
        const rawEvent = buffer.slice(0, idx);
        buffer = buffer.slice(idx + 2);
        const dataLines = rawEvent.match(/^data:\s?.*$/gm) || [];
        for (const line of dataLines) {
          const payload = line.replace(/^data:\s?/, "");
          if (!payload) continue;
          if (payload === "[DONE]") break outer;

          let toAppend = "";
          try {
            const obj = JSON.parse(payload);
            if (typeof obj === "string") {
              toAppend = obj;
            } else if (typeof obj.content === "string") {
              toAppend = obj.content;
            } else if (obj.type === "content" && typeof obj.content === "string") {
              toAppend = obj.content;
            } else if (typeof obj.delta === "string") {
              toAppend = obj.delta;
            } else if (typeof obj.message === "string" && !obj.status) {
              toAppend = obj.message;
            }
          } catch {
            if (!payload.startsWith("{") && !payload.startsWith("[")) {
              toAppend = payload;
            }
          }

          if (toAppend) {
            full += toAppend;
            setMessages((prev) => prev.map((m) => (m.id === msgId ? { ...m, content: (m.content || "") + toAppend } : m)));
          }
        }
      }
    }
    return full;
  };

  const send = async () => {
    if (!input.trim() || loading) return;
    const user: Msg = { id: crypto.randomUUID(), role: "user", content: input };
    setMessages((m) => [...m, user]);
    setInput("");
    setLoading(true);
    try {
      const assistantId = crypto.randomUUID();
      setMessages((m) => [...m, { id: assistantId, role: "assistant", content: "" }]);
      const chatRes = await fetch("/api/agent/chat-stream", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "text/event-stream" },
        body: JSON.stringify({ message: user.content, systemPromptId: selectedPrompt }),
      });
      const chatText = await streamIntoMessage(chatRes, assistantId);
      const addr = extractAddress(chatText);
      if (addr) {
        const analyzeId = crypto.randomUUID();
        setMessages((m) => [...m, { id: analyzeId, role: "assistant", content: "" }]);
        const analyzeRes = await fetch("/api/agent/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ address: addr }),
        });
        await streamIntoMessage(analyzeRes, analyzeId);
      }
    } catch (e) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: "assistant", content: "Sorry, something went wrong." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f16] via-[#0b1220] to-[#04070c]">
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex min-h-screen flex-col">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/50 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <div className="grid h-6 w-6 place-items-center rounded-md bg-blue-500/20 text-blue-300"><MessageSquare className="h-4 w-4" /></div>
              Daemon Copilot
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">Status</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>

          {/* Prompt selector */}
          <div className="flex items-center gap-2 border-b bg-muted/10 px-4 py-2 text-xs md:px-6">
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

          {/* Chat area */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            {/* Welcome card */}
            {messages.length <= 1 && (
              <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/90 shadow-xl">
                <div className="mb-1 text-[13px] font-semibold text-white/95">Welcome to Daemon Copilot</div>
                <p className="mb-2 text-[12px] text-white/70">How can I assist you with your investigation today? You can ask me things like:</p>
                <ul className="list-disc space-y-1 pl-5 text-[12px]">
                  <li><button className="underline-offset-4 hover:underline" onClick={() => insert("Audit this smart contract: 0x...")}>Audit this smart contract: 0x…</button></li>
                  <li><button className="underline-offset-4 hover:underline" onClick={() => insert("Give me a summary of this transaction: txhash…")}>Give me a summary of this transaction: txhash…</button></li>
                  <li><button className="underline-offset-4 hover:underline" onClick={() => insert("Trace the funds from this address: address…")}>Trace the funds from this address: address…</button></li>
                  <li><button className="underline-offset-4 hover:underline" onClick={() => insert("Analyze security risks for: wallet_address")}>Analyze security risks for: wallet_address</button></li>
                </ul>
                <p className="mt-2 text-[12px] text-white/60">I can perform real-time blockchain analysis and provide detailed security reports!</p>
              </div>
            )}

            {messages.map((m) => (
              <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
                <div className={
                  m.role === "user"
                    ? "inline-block max-w-[80%] rounded-2xl bg-primary/90 px-4 py-2 text-primary-foreground"
                    : "inline-block max-w-[80%] rounded-2xl bg-white/5 px-4 py-2 text-white/90"
                }>
                  {m.content}
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="border-t bg-background/60 p-3 backdrop-blur">
            <div className="mx-auto flex max-w-3xl items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && send()}
                placeholder="Ask Daemon Copilot anything or paste an address to analyze…"
                className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
              <Button onClick={send} disabled={loading}>Send</Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
