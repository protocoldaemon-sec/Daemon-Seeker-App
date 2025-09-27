import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import GlowParticles from "@/components/GlowParticles";
import { CheckCircle2, ArrowLeft, Send } from "lucide-react";

interface Msg {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function ChatCopilot() {
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hi! I’m your AI Copilot. How can I help?",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

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

  const streamIntoMessage = async (
    res: Response,
    msgId: string,
  ): Promise<string> => {
    const reader = res.body?.getReader();
    if (!reader) return "";
    const decoder = new TextDecoder();
    const isSSE = (res.headers.get("content-type") || "").includes(
      "text/event-stream",
    );
    let full = "";

    if (!isSSE) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setMessages((prev) =>
          prev.map((m) =>
            m.id === msgId ? { ...m, content: (m.content || "") + chunk } : m,
          ),
        );
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
            } else if (
              obj.type === "content" &&
              typeof obj.content === "string"
            ) {
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
            setMessages((prev) =>
              prev.map((m) =>
                m.id === msgId
                  ? { ...m, content: (m.content || "") + toAppend }
                  : m,
              ),
            );
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
      setMessages((m) => [
        ...m,
        { id: assistantId, role: "assistant", content: "" },
      ]);
      const chatRes = await fetch("/api/agent/chat-stream", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({ message: user.content }),
      });
      const chatText = await streamIntoMessage(chatRes, assistantId);
      const addr = extractAddress(chatText);
      if (addr) {
        const analyzeId = crypto.randomUUID();
        setMessages((m) => [
          ...m,
          { id: analyzeId, role: "assistant", content: "" },
        ]);
        const analyzeRes = await fetch(
          `/api/agent/analyze/${encodeURIComponent(addr)}`,
          {
            method: "GET",
            headers: { Accept: "text/event-stream" },
          },
        );
        await streamIntoMessage(analyzeRes, analyzeId);
      }
    } catch (e) {
      setMessages((m) => [
        ...m,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: "Sorry, something went wrong.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-background">
      <GlowParticles count={22} color="56,189,248" />
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex min-h-screen flex-col">
          {/* Top bar */}
          <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-background/50 px-4 py-3 backdrop-blur md:px-6">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Link
                to="/home"
                className="mr-1 grid h-8 w-8 place-items-center rounded-md border bg-background/70 text-muted-foreground hover:bg-background"
              >
                <ArrowLeft className="h-4 w-4" />
              </Link>
              Daemon Copilot
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="hidden sm:inline">Status</span>
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            </div>
          </div>

          {/* Chat area */}
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            {/* Welcome card */}
            {messages.length <= 1 && (
              <div className="w-full max-w-md rounded-2xl border bg-card p-4 text-sm text-foreground shadow-xl">
                <div className="mb-1 text-[13px] font-semibold">
                  Welcome to Daemon Copilot
                </div>
                <p className="mb-2 text-[12px] text-muted-foreground">
                  How can I assist you with your investigation today? You can
                  ask me things like:
                </p>
                <ul className="list-disc space-y-1 pl-5 text-[12px]">
                  <li>
                    <button
                      className="underline-offset-4 hover:underline"
                      onClick={() => insert("Audit this smart contract: 0x...")}
                    >
                      Audit this smart contract: 0x…
                    </button>
                  </li>
                  <li>
                    <button
                      className="underline-offset-4 hover:underline"
                      onClick={() =>
                        insert("Give me a summary of this transaction: txhash…")
                      }
                    >
                      Give me a summary of this transaction: txhash…
                    </button>
                  </li>
                  <li>
                    <button
                      className="underline-offset-4 hover:underline"
                      onClick={() =>
                        insert("Trace the funds from this address: address…")
                      }
                    >
                      Trace the funds from this address: address…
                    </button>
                  </li>
                  <li>
                    <button
                      className="underline-offset-4 hover:underline"
                      onClick={() =>
                        insert("Analyze security risks for: wallet_address")
                      }
                    >
                      Analyze security risks for: wallet_address
                    </button>
                  </li>
                </ul>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  I can perform real-time blockchain analysis and provide
                  detailed security reports!
                </p>
              </div>
            )}

            {messages.map((m) => (
              <div
                key={m.id}
                className={
                  m.role === "user" ? "flex justify-end" : "flex justify-start"
                }
              >
                <div
                  className={
                    m.role === "user"
                      ? "inline-block max-w-[80%] rounded-2xl bg-primary px-4 py-2 text-primary-foreground break-words whitespace-pre-wrap"
                      : "inline-block max-w-[80%] rounded-2xl bg-muted px-4 py-2 text-foreground break-words whitespace-pre-wrap"
                  }
                >
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
              <Button
                onClick={send}
                disabled={loading}
                size="icon"
                aria-label="Send message"
                title="Send"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
