"use client";

import { useState } from "react";
import Link from "next/link";
import { changePassword } from "@/lib/auth";
import { validatePassword } from "@/utils/validation";

export default function SettingsPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError("");
    setSuccess("");

    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (password !== confirm) {
      setError("Senhas não batem");
      return;
    }

    setLoading(true);
    try {
      await changePassword(password);
      setSuccess("Senha alterada! Faça login de novo.");
      setPassword("");
      setConfirm("");
    } catch (err) {
      setError("Não foi possível alterar a senha. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      <div className="max-w-xl mx-auto py-10">
        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-blue-500 italic tracking-tighter">
              Settings
            </h1>
            <p className="text-sm text-gray-500 mt-1">Gerencie sua conta.</p>
          </div>
          <Link
            href="/"
            className="text-xs font-bold text-white/50 hover:text-white border border-white/10 rounded-full px-3.5 py-2 active:scale-95 transition-all"
          >
            ← Voltar
          </Link>
        </header>

        {/* ── Divisor ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-white/5" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-bold">
            Alterar senha
          </p>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        {/* ── Formulário ─────────────────────────────────────────── */}
        <div className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-bold">
              Nova senha
            </label>
            <input
              type="password"
              value={password}
              placeholder="••••••••"
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-3 mt-1 outline-none focus:border-blue-500 transition-all text-sm"
            />
          </div>

          <div>
            <label className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-bold">
              Confirmar senha
            </label>
            <input
              type="password"
              value={confirm}
              placeholder="••••••••"
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-transparent border-b border-white/10 py-3 mt-1 outline-none focus:border-blue-500 transition-all text-sm"
            />
          </div>

          {error && (
            <p className="text-sm text-red-400 font-bold">{error}</p>
          )}
          {success && (
            <p className="text-sm text-blue-400 font-bold">{success}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-400 disabled:bg-white/10 disabled:text-white/40 text-white font-bold rounded-full py-3 active:scale-95 transition-all text-sm"
          >
            {loading ? "Atualizando..." : "Atualizar senha"}
          </button>
        </div>
      </div>
    </main>
  );
}