import { useState } from "react";
import { Button } from "@/components/ui/button";
import bs58 from "bs58";
import { useNavigate } from "react-router-dom";

const API = "https://daemonprotocol-be-production.up.railway.app";

export default function LoginSolana() {
  const [address, setAddress] = useState("");
  const [nonce, setNonce] = useState("");
  const [signature, setSignature] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const message = nonce ? `Sign in to Daemon Protocol\nNonce: ${nonce}` : "";

  const connectWallet = async () => {
    try {
      const provider = window.solana;
      if (!provider) {
        alert("Phantom wallet not found. Please install Phantom.");
        return;
      }
      const res = await provider.connect();
      const pk = (res?.publicKey as any)?.toBase58?.() ?? (provider.publicKey as any)?.toBase58?.();
      if (pk) {
        setAddress(pk);
        localStorage.setItem("wallet_address", pk);
      }
    } catch (e) {
      console.error(e);
      alert("Wallet connection failed");
    }
  };

  const getNonce = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/nonce`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chain: "solana", address }),
      });
      const data = await res.json();
      setNonce(String(data.nonce ?? ""));
    } catch (e) {
      console.error(e);
      alert("Failed to fetch nonce");
    } finally {
      setLoading(false);
    }
  };

  const signWithWallet = async () => {
    try {
      const provider = window.solana;
      if (!provider || !nonce) return;
      const encoded = new TextEncoder().encode(message);
      const { signature: sigBytes } = await provider.signMessage(encoded, "utf8");
      const b58 = bs58.encode(sigBytes);
      setSignature(b58);
      await verify(b58);
    } catch (e) {
      console.error(e);
      alert("Signing failed");
    }
  };

  const verify = async (sig?: string) => {
    const finalSig = sig ?? signature;
    if (!address || !nonce || !finalSig) {
      alert("Address, nonce and signature are required");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${API}/auth/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chain: "solana",
          address,
          nonce,
          message,
          signature: finalSig,
        }),
      });
      const data = await res.json();
      if (data?.token) {
        setToken(data.token);
        localStorage.setItem("daemon_token", data.token);
        navigate("/home");
      } else {
        alert("Verification failed");
      }
    } catch (e) {
      console.error(e);
      alert("Verification error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto grid min-h-screen grid-cols-1 md:grid-cols-[16rem_1fr]">
        <div className="hidden md:block" />
        <main className="flex flex-col items-center justify-center px-4 py-8">
          <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-sm">
            <h1 className="mb-1 text-2xl font-semibold">Login with Solana</h1>
            <p className="mb-6 text-sm text-muted-foreground">
              Connect your wallet, fetch a nonce, and sign the message for secure authentication.
            </p>

            <div className="mb-4 flex items-center gap-2">
              <Button onClick={connectWallet} variant="secondary">Connect Phantom</Button>
              {address && <span className="truncate text-xs text-muted-foreground">{address}</span>}
            </div>

            <label className="mb-1 block text-sm font-medium">Address (base58)</label>
            <input
              className="mb-4 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              placeholder="Enter your public key"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="flex items-center gap-2">
              <Button onClick={getNonce} disabled={!address || loading}>Get Nonce</Button>
              {nonce && <span className="text-xs text-muted-foreground">nonce: {nonce}</span>}
            </div>

            {nonce && (
              <div className="mt-6">
                <label className="mb-1 block text-sm font-medium">Message to sign</label>
                <textarea
                  className="w-full resize-none rounded-md border bg-muted/40 px-3 py-2 text-sm"
                  rows={3}
                  readOnly
                  value={message}
                />
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Button onClick={signWithWallet} variant="default">Sign with Wallet</Button>
                  <span className="text-xs text-muted-foreground">or paste signature manually</span>
                </div>
                <label className="mt-4 mb-1 block text-sm font-medium">Signature (Base58)</label>
                <input
                  className="mb-4 w-full rounded-md border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Paste signature"
                  value={signature}
                  onChange={(e) => setSignature(e.target.value)}
                />
                <Button onClick={() => verify()} disabled={loading || !signature}>Verify</Button>
              </div>
            )}

            {token && (
              <div className="mt-6 rounded-md bg-green-50 p-3 text-sm text-green-700">
                Authenticated. Token saved. Redirecting to Home…
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
