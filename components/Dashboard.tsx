'use client'

import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { buscarOuCriarPerfil, type Perfil } from '@/lib/gamification'
import { RankCard } from './RankCard'
import { QuickStats } from './QuickStats'
import { ResumoGeral } from './ResumoGeral'
import { EvolucaoChart } from './EvolucaoChart'
import { RegistrarPeso } from './RegistrarPeso'

interface Treino {
  id: string | number
  exercicio: string
  series: number
  reps: number
  peso: number
  carga_total: number
  created_at: string
}

interface Pr {
  exercicio: string
  carga: number
  created_at: string
}

interface PesoRegistro {
  peso_kg: number
  created_at: string
}

interface DashboardProps {
  treinos: Treino[]
  refreshKey: number
}

export function Dashboard({ treinos, refreshKey }: DashboardProps) {
  const [perfil, setPerfil] = useState<Perfil | null>(null)
  const [prs, setPrs] = useState<Pr[]>([])
  const [pesos, setPesos] = useState<PesoRegistro[]>([])
  const [carregando, setCarregando] = useState(true)

  const carregarDados = useCallback(async () => {
    const [perfilData, prsResp, pesosResp] = await Promise.all([
      buscarOuCriarPerfil(),
      supabase.from('prs').select('exercicio, carga, created_at').order('created_at', { ascending: false }),
      supabase.from('pesos').select('peso_kg, created_at').order('created_at', { ascending: false }),
    ])

    setPerfil(perfilData)
    if (prsResp.data) setPrs(prsResp.data as Pr[])
    if (pesosResp.data) setPesos(pesosResp.data as PesoRegistro[])
    setCarregando(false)
  }, [])

  useEffect(() => {
    carregarDados()
  }, [carregarDados, refreshKey])

  if (carregando) {
    return (
      <div className="space-y-4 animate-pulse mb-8">
        <div className="h-40 rounded-2xl bg-white/5" />
        <div className="grid grid-cols-2 gap-3">
          <div className="h-20 rounded-xl bg-white/5" />
          <div className="h-20 rounded-xl bg-white/5" />
          <div className="h-20 rounded-xl bg-white/5" />
          <div className="h-20 rounded-xl bg-white/5" />
        </div>
      </div>
    )
  }

  const totalTreinos = treinos.length
  const totalPrs = prs.length
  const primeiroTreinoData =
    treinos.length > 0 ? treinos[treinos.length - 1].created_at : null
  const ultimoTreino = treinos[0] ?? null
  const ultimoPr = prs[0] ?? null
  const pesoAtual = pesos[0]?.peso_kg ?? null

  return (
    <section className="space-y-4 mb-10">
      <RankCard xpAtual={perfil?.xp_atual ?? 0} />

      <QuickStats
        streakDias={perfil?.streak_dias ?? 0}
        pesoAtual={pesoAtual}
        ultimoPr={ultimoPr ? { exercicio: ultimoPr.exercicio, carga: ultimoPr.carga } : null}
        ultimoTreino={ultimoTreino ? { exercicio: ultimoTreino.exercicio, created_at: ultimoTreino.created_at } : null}
      />

      <ResumoGeral
        totalTreinos={totalTreinos}
        totalPrs={totalPrs}
        primeiroTreinoData={primeiroTreinoData}
      />

      <div>
        <EvolucaoChart pesos={pesos} treinos={treinos} />
        <div className="flex justify-end mt-2">
          <RegistrarPeso onSave={carregarDados} />
        </div>
      </div>
    </section>
  )
}