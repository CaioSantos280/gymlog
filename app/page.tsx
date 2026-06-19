'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { TreinoForm } from '@/components/TreinoForm'
import { TreinoCard } from '@/components/TreinoCard'
import { Dashboard } from '@/components/Dashboard'

interface Treino {
  id: string | number
  exercicio: string
  series: number
  reps: number
  peso: number
  carga_total: number
  created_at: string
}

export default function Home() {
  const [treinos, setTreinos] = useState<Treino[]>([])
  const [busca, setBusca] = useState('')
  const [refreshKey, setRefreshKey] = useState(0)

  const buscarTreinos = useCallback(async () => {
    const { data, error } = await supabase
      .from('treinos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erro ao buscar treinos:', error.message)
      return
    }

    if (data) {
      setTreinos(data as Treino[])
      // incrementa refreshKey para a Dashboard recarregar perfil/PRs/pesos também
      setRefreshKey((k) => k + 1)
    }
  }, [])

  useEffect(() => {
    buscarTreinos()
  }, [buscarTreinos])

  const treinosFiltrados = treinos.filter((t) =>
    t.exercicio?.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      <div className="max-w-xl mx-auto py-10">

        {/* ── Header ─────────────────────────────────────────────── */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-blue-500 italic tracking-tighter">
              GYMLOG
            </h1>
            <p className="text-sm text-gray-500 mt-1">Track your progress.</p>
          </div>
          <Link
            href="/perfil"
            className="text-xs font-bold text-white/50 hover:text-white border border-white/10 rounded-full px-3.5 py-2 active:scale-95 transition-all"
          >
            👤 Perfil
          </Link>
        </header>

        {/* ── Dashboard ──────────────────────────────────────────── */}
        <Dashboard treinos={treinos} refreshKey={refreshKey} />

        {/* ── Divisor ────────────────────────────────────────────── */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-px flex-1 bg-white/5" />
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-bold">
            Registrar treino
          </p>
          <div className="h-px flex-1 bg-white/5" />
        </div>

        {/* ── Formulário (inalterado) ─────────────────────────────── */}
        <TreinoForm onSave={buscarTreinos} />

        {/* ── Busca no histórico ──────────────────────────────────── */}
        <div className="relative my-8">
          <input
            type="text"
            placeholder="🔍 Buscar no seu histórico..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-blue-500 transition-all text-sm"
          />
          {busca && (
            <button
              onClick={() => setBusca('')}
              className="absolute right-2 top-3 text-gray-500 hover:text-white"
            >
              Limpar
            </button>
          )}
        </div>

        {/* ── Lista de treinos (inalterada) ───────────────────────── */}
        <div className="space-y-4">
          {treinosFiltrados.length > 0 ? (
            treinosFiltrados.map((t) => (
              <TreinoCard key={t.id} treino={t} onDelete={buscarTreinos} />
            ))
          ) : (
            <p className="text-center text-gray-600 py-10 italic">
              {busca ? 'Nenhum exercício encontrado...' : 'Nenhum treino registrado.'}
            </p>
          )}
        </div>

      </div>
    </main>
  )
}