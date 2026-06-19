'use client'

interface PerfilStatsProps {
  xpTotal: number
  streakDias: number
  totalTreinos: number
  totalPrs: number
  pesoAtual: number | null
}

function StatBox({ icone, label, valor }: { icone: string; label: string; valor: string }) {
  return (
    <div className="bg-[#121212] rounded-xl border border-white/5 p-3 flex flex-col items-center text-center gap-0.5">
      <span className="text-base">{icone}</span>
      <p className="text-base font-black leading-tight">{valor}</p>
      <p className="text-[9px] uppercase tracking-wide text-white/40 font-bold">{label}</p>
    </div>
  )
}

export function PerfilStats({ xpTotal, streakDias, totalTreinos, totalPrs, pesoAtual }: PerfilStatsProps) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-3 px-1">
        Estatísticas
      </p>
      <div className="grid grid-cols-3 gap-2.5">
        <StatBox icone="⭐" label="XP Total" valor={xpTotal.toLocaleString('pt-BR')} />
        <StatBox icone="🔥" label="Streak" valor={`${streakDias}d`} />
        <StatBox icone="🏋️" label="Treinos" valor={String(totalTreinos)} />
        <StatBox icone="🏆" label="PRs" valor={String(totalPrs)} />
        <StatBox icone="⚖️" label="Peso" valor={pesoAtual ? `${pesoAtual}kg` : '—'} />
      </div>
    </div>
  )
}