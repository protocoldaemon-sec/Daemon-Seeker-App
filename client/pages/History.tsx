import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Filter } from "lucide-react";
import { useMemo, useState } from "react";

interface Txn {
  id: string;
  type: "Deposit" | "Withdrawal" | "Swap" | "Stake" | "Unstake";
  amount: number;
  status: "Completed" | "Pending" | "Failed";
  date: string; // ISO string
  hash: string;
}

const SAMPLE: Txn[] = [
  { id: "1", type: "Deposit", amount: 1.23, status: "Completed", date: new Date(Date.now() - 2 * 86400000).toISOString(), hash: "0xabc...111" },
  { id: "2", type: "Swap", amount: 0.42, status: "Pending", date: new Date(Date.now() - 10 * 86400000).toISOString(), hash: "0xdef...222" },
  { id: "3", type: "Withdrawal", amount: 5.0, status: "Failed", date: new Date(Date.now() - 40 * 86400000).toISOString(), hash: "0xghi...333" },
];

export default function History() {
  const [open, setOpen] = useState(false);
  const [timeRange, setTimeRange] = useState<string>("7"); // days: 7|30|90|all
  const [type, setType] = useState<string>("all");
  const [status, setStatus] = useState<string>("all");

  const filtered = useMemo(() => {
    let list = SAMPLE;
    // time filter
    if (timeRange !== "all") {
      const days = Number(timeRange);
      const cutoff = Date.now() - days * 86400000;
      list = list.filter((t) => new Date(t.date).getTime() >= cutoff);
    }
    // type filter
    if (type !== "all") list = list.filter((t) => t.type.toLowerCase() === type);
    // status filter
    if (status !== "all") list = list.filter((t) => t.status.toLowerCase() === status);
    return list;
  }, [timeRange, type, status]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex min-h-screen flex-col p-4 md:p-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Transaction History</h2>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Popover open={open} onOpenChange={setOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="secondary" className="rounded-lg bg-white/10 text-white hover:bg-white/15">
                      <Filter className="mr-2 h-4 w-4" /> Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 rounded-xl border-white/10 bg-[#0f1623] text-white">
                    <div className="space-y-3">
                      <div>
                        <div className="mb-1 text-xs text-white/60">Time Range</div>
                        <select
                          value={timeRange}
                          onChange={(e) => setTimeRange(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="7">Last 7 days</option>
                          <option value="30">Last 30 days</option>
                          <option value="90">Last 90 days</option>
                          <option value="all">All time</option>
                        </select>
                      </div>
                      <div>
                        <div className="mb-1 text-xs text-white/60">Type</div>
                        <select
                          value={type}
                          onChange={(e) => setType(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Types</option>
                          <option value="deposit">Deposit</option>
                          <option value="withdrawal">Withdrawal</option>
                          <option value="swap">Swap</option>
                          <option value="stake">Stake</option>
                          <option value="unstake">Unstake</option>
                        </select>
                      </div>
                      <div>
                        <div className="mb-1 text-xs text-white/60">Status</div>
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value)}
                          className="w-full rounded-xl border border-white/10 bg-[#0b1220] px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="all">All Statuses</option>
                          <option value="completed">Completed</option>
                          <option value="pending">Pending</option>
                          <option value="failed">Failed</option>
                        </select>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <span className="text-xs text-white/60">Showing {filtered.length} of {SAMPLE.length} transactions</span>
              </div>
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10 bg-[#0b1220]/60">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Transaction</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="p-8 text-center text-sm text-white/60">
                        No transactions found matching your filters.
                      </TableCell>
                    </TableRow>
                  ) : (
                    filtered.map((t) => (
                      <TableRow key={t.id}>
                        <TableCell>{t.type}</TableCell>
                        <TableCell>{t.amount}</TableCell>
                        <TableCell>{t.status}</TableCell>
                        <TableCell>{new Date(t.date).toLocaleDateString()}</TableCell>
                        <TableCell className="font-mono text-xs text-white/80">{t.hash}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableCaption className="sr-only">Your recent transactions</TableCaption>
              </Table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
