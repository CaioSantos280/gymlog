'use client'

import { useEffect, useState, useCallback } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { buscarOuCriarPerfil, salvarAvatarSelecionado, type Perfil } from '@/lib/gamification'
import { buscarAvatarPorId, type AvatarDef } from '@/lib/Avatars'
import { AvatarHero } from '@/components/AvatarHero'
import { AvatarGrid } from '@/components/Avatargrid'
import { PerfilStats } from '@/components/Perfilstats'
import { PerfilConquistas } from '@/components/Perfilconquistas'
import { RankTimeline } from '@/components/Ranktimeline'
import { PerfilRecordes } from '@/components/Perfilrecordes'

interface Pr {
  exercicio: string
  carga: number
  created_at: string
}

interface PesoRegistro {
  peso_kg: number
  created_at: string
}

export default function PerfilPage() {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [prs, setPrs] = useState<Pr[]>([])
  const [pesos, setPesos] = useState<PesoRegistro[]>([])
  const [totalTreinos, setTotalTreinos] = useState(0)
  const [carregando, setCarregando] = useState(true)
  const [salvandoAvatar, setSalvandoAvatar] = useState(false)

  const carregarDados = useCallback(async () => {
    setCarregando(true)
    const [perfilData, prsResp, pesosResp, treinosResp] = await Promise.all([
      buscarOuCriarPerfil(),
      supabase.from('prs').select('exercicio, carga, created_at').order('created_at', { ascending: false }),
      supabase.from('pesos').select('peso_kg, created_at').order('created_at', { ascending: false }),
      supabase.from('treinos').select('id', { count: 'exact', head: true }),
    ])

    if (perfilData) {
      // Garante que se o nome vier NULL do banco, ele exiba um fallback em vez de quebrar a UI
      setPerfil({
        ...perfilData,
        nome_usuario: perfilData.nome_usuario || 'Atleta'
      })
    }
    
    if (prsResp.data) setPrs(prsResp.data as Pr[])
    if (pesosResp.data) setPesos(pesosResp.data as PesoRegistro[])
    if (typeof treinosResp.count === 'number') setTotalTreinos(treinosResp.count)
    setCarregando(false)
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados])

  async function handleSelecionarAvatar(avatar: AvatarDef) {
    if (!perfil || salvandoAvatar) return
    setSalvandoAvatar(true)
    const sucesso = await salvarAvatarSelecionado(perfil.id, avatar.id)
    if (sucesso) {
      setPerfil((prev) => prev ? { ...prev, avatar_id: avatar.id } : null)
    }
    setSalvandoAvatar(false)
  }

  if (carregando || !perfil) {
    return (
      <main className="min-h-screen bg-[#0a0a0a] text-white p-4">
        <div className="max-w-md mx-auto py-8 space-y-4 animate-pulse">
          <div className="h-72 rounded-2xl bg-white/5" />
          <div className="h-40 rounded-xl bg-white/5" />
          <div className="h-52 rounded-xl bg-white/5" />
        </div>
      </main>
    )
  }

  const avatarAtual = buscarAvatarPorId(perfil.avatar_id)
  const pesoAtual = pesos[0]?.peso_kg ?? null

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-md mx-auto px-4 py-6 pb-16 space-y-5">

        {/* ── Header com navegação ─────────────────────────────────── */}
        <header className="flex items-center justify-between">
          <Link
            href="/"
            className="text-sm font-bold text-white/50 hover:text-white flex items-center gap-1.5 active:scale-95 transition-all"
          >
            ← GYMLOG
          </Link>
          <p className="text-xs uppercase tracking-[0.2em] text-white/30 font-bold">
            Perfil
          </p>
        </header>

        {/* ── Avatar principal + Rank + XP ─────────────────────────── */}
        <AvatarHero
          avatar={avatarAtual}
          nomeUsuario={perfil.nome_usuario || 'Atleta'}
          xpAtual={perfil.xp_atual}
          perfilId={perfil.id}
          onNomeAtualizado={(novoNome) => setPerfil((prev) => prev ? { ...prev, nome_usuario: novoNome } : null)}
        />

        {/* ── Estatísticas ──────────────────────────────────────────── */}
        <PerfilStats
          xpTotal={perfil.xp_atual}
          streakDias={perfil.streak_dias}
          totalTreinos={totalTreinos}
          totalPrs={prs.length}
          pesoAtual={pesoAtual}
        />

        {/* ── Seleção de Avatares ───────────────────────────────────── */}
        <AvatarGrid
          xpAtual={perfil.xp_atual}
          avatarSelecionadoId={perfil.avatar_id}
          onSelecionar={handleSelecionarAvatar}
          salvando={salvandoAvatar}
        />

        {/* ── Conquistas ────────────────────────────────────────────── */}
        <PerfilConquistas
          totalTreinos={totalTreinos}
          totalPrs={prs.length}
          streakDias={perfil.streak_dias}
          xpAtual={perfil.xp_atual}
        />

        {/* ── Timeline de Ranks ─────────────────────────────────────── */}
        <RankTimeline xpAtual={perfil.xp_atual} />

        {/* ── Recordes Pessoais ─────────────────────────────────────── */}
        <PerfilRecordes prs={prs} />

      </div>
    </main>
  )
}
