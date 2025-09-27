import Sidebar from "@/components/Sidebar";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

export default function History() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f16] via-[#0b1220] to-[#04070c] text-foreground">
      <div className="md:grid md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex min-h-screen flex-col p-4 md:p-6">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 shadow-xl">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold text-white">Transaction History</h2>
              <div className="flex items-center gap-3 text-sm text-white/80">
                <Button variant="secondary" className="rounded-lg bg-white/10 text-white hover:bg-white/15">Filters</Button>
                <span className="text-xs text-white/60">Showing 0 of 0 transactions</span>
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
                  <TableRow>
                    <TableCell colSpan={5} className="p-8 text-center text-sm text-white/60">No transactions found matching your filters.</TableCell>
                  </TableRow>
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
