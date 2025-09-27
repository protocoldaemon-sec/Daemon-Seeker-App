import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
  const [project, setProject] = useState("");
  const [language, setLanguage] = useState<"solana" | "evm">("solana");
  const [version, setVersion] = useState("1.0");
  const [contractType, setContractType] = useState("");
  const [address, setAddress] = useState("");
  const [commit, setCommit] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");

  const startAudit = async () => {
    if (loading) return;
    setLoading(true);
    setResult("");
    try {
      const tasks: Promise<string>[] = [];
      if (address.trim()) {
        if (language === "evm") {
          tasks.push(fetch(`/api/daemon/address/${encodeURIComponent(address)}/risk-score`).then(r=>r.text()));
          tasks.push(fetch(`/api/daemon/eth/txlist/${encodeURIComponent(address)}`).then(r=>r.text()));
          tasks.push(fetch(`/api/daemon/analyze/${encodeURIComponent(address)}`).then(async (r)=>{
            const reader = r.body?.getReader();
            if (!reader) return "";
            const dec = new TextDecoder();
            let acc = "";
            while (true) { const {done, value} = await reader.read(); if (done) break; acc += dec.decode(value,{stream:true}); }
            return acc;
          }));
        } else {
          tasks.push(fetch(`/api/daemon/sol/address/${encodeURIComponent(address)}/transactions`).then(r=>r.text()));
          tasks.push(fetch(`/api/daemon/sol/address/${encodeURIComponent(address)}/balance-changes`).then(r=>r.text()));
          tasks.push(fetch(`/api/daemon/sol/address/${encodeURIComponent(address)}/signatures`).then(r=>r.text()));
        }
      }
      const outputs = await Promise.allSettled(tasks);
      const joined = outputs.map((o,i)=>`--- Section ${i+1} ---\n${o.status==='fulfilled'?o.value:o.reason}`).join("\n\n");
      setResult(joined || "No data fetched. Provide an address to analyze.");
    } catch (e) {
      setResult("Audit failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block"><Sidebar/></div>
        <main className="min-h-screen">
          <header className="sticky top-0 z-50 flex items-center justify-between border-b bg-background px-4 py-4 md:hidden">
            <MobileNav />
            <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-base font-semibold">Daemon</div>
            <div className="w-10" />
          </header>

          <section className="px-4 py-8 md:px-8">
            <div className="rounded-2xl border bg-card p-6 shadow-lg">
              <h1 className="mb-4 text-xl font-semibold">Smart Contract Pre-Audit</h1>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="md:col-span-2">
                  <Label>Project Name</Label>
                  <Input value={project} onChange={(e)=>setProject(e.target.value)} placeholder="Enter project name" />
                </div>
                <div className="md:col-span-2">
                  <Label>Auditor</Label>
                  <Input value="Daemon Protocol" readOnly />
                </div>
                <div>
                  <Label>Language</Label>
                  <Select value={language} onValueChange={(v)=>setLanguage(v as any)}>
                    <SelectTrigger><SelectValue placeholder="Select Language" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="solana">Rust (Solana)</SelectItem>
                      <SelectItem value="evm">Solidity (EVM)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Version</Label>
                  <Input value={version} onChange={(e)=>setVersion(e.target.value)} />
                </div>
                <div className="md:col-span-2">
                  <Label>Contract Type</Label>
                  <Input value={contractType} onChange={(e)=>setContractType(e.target.value)} placeholder="ERC20, NFT, DeFi protocol..." />
                </div>
                <div>
                  <Label>{language === 'evm' ? 'Wallet/Contract Address' : 'Solana Address'}</Label>
                  <Input value={address} onChange={(e)=>setAddress(e.target.value)} placeholder={language==='evm'?"0x...":"..."} />
                </div>
                <div>
                  <Label>Commit Hash</Label>
                  <Input value={commit} onChange={(e)=>setCommit(e.target.value)} placeholder="abc123..." />
                </div>
                <div className="md:col-span-2">
                  <Label>Smart Contract File</Label>
                  <input type="file" accept=".sol,.rs" className="mt-2 w-full rounded-md border bg-background p-2" onChange={(e)=>setFile(e.target.files?.[0]||null)} />
                  <p className="mt-1 text-xs text-muted-foreground">Supported: Solidity (.sol) or Rust (.rs)</p>
                </div>
                <div className="md:col-span-2">
                  <Button onClick={startAudit} disabled={loading} className="w-full">{loading?"Analyzing...":"Start Audit"}</Button>
                </div>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border bg-card p-4">
              <h2 className="mb-2 text-lg font-semibold">Results</h2>
              <pre className="max-h-[50vh] overflow-auto whitespace-pre-wrap break-words text-sm">{result}</pre>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
