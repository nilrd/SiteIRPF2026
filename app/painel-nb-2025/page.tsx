"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status } = useSession();

  // Se já está autenticado, vai direto ao dashboard
  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/painel-nb-2025/dashboard");
    }
  }, [status, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const callbackUrl =
      searchParams.get("callbackUrl") || "/painel-nb-2025/dashboard";

    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });

    if (res?.error) {
      setError("Credenciais invalidas");
      setLoading(false);
    } else {
      // Garante navegação limpa sem loop
      router.replace(
        callbackUrl.startsWith("/painel-nb-2025/")
          ? callbackUrl
          : "/painel-nb-2025/dashboard"
      );
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-serif text-2xl mb-8 text-center">
          Painel NSB
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-white transition text-white"
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest opacity-50 block mb-2">
              Senha
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full bg-transparent border-b border-white/20 py-3 outline-none focus:border-white transition text-white"
            />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black py-4 uppercase text-xs tracking-widest font-bold hover:bg-white/90 transition disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
