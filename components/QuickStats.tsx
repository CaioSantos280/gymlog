'use client'

interface QuickStatsProps {
  streakDias: number
  pesoAtual: number | null
  ultimoPr: { exercicio: string; carga: number } | null
  ultimoTreino: { exercicio: string; created_at: string } | null
}

function StatCard({
  icone,
  label,
  valor,
  sub,
}: {
  icone: string
  label: string
  valor: string
  sub?: string
}) {
  return (
    <div className="bg-[#121212] rounded-xl border border-white/5 p-4 flex flex-col gap-1 hover:border-white/10 transition-colors">
      <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-wider text-white/40 font-bold">
        <span>{icone}</span>
        <span>{label}</span>
      </div>
      <p className="text-lg font-black leading-tight truncate">{valor}</p>
      {sub && <p className="text-[11px] text-white/40 truncate">{sub}</p>}
    </div>
  )
}

export function QuickStats({ streakDias, pesoAtual, ultimoPr, ultimoTreino }: QuickStatsProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <StatCard
        icone="🔥"
        label="Streak"
        valor={streakDias > 0 ? `${streakDias} ${streakDias === 1 ? 'dia' : 'dias'}` : '—'}
        sub={streakDias > 0 ? 'seguidos treinando' : 'comece hoje'}
      />
      <StatCard
        icone="⚖️"
        label="Peso atual"
        valor={pesoAtual ? `${pesoAtual} kg` : '—'}
        sub={pesoAtual ? 'última pesagem' : 'sem registros'}
      />
      <StatCard
        icone="💪"
        label="Último PR"
        valor={ultimoPr ? `${ultimoPr.carga}kg` : '—'}
        sub={ultimoPr ? ultimoPr.exercicio : 'nenhum ainda'}
      />
      <StatCard
        icone="🏋️"
        label="Último treino"
        valor={ultimoTreino ? ultimoTreino.exercicio : '—'}
        sub={
          ultimoTreino
            ? new Date(ultimoTreino.created_at).toLocaleDateString('pt-BR')
            : 'sem registros'
        }
      />
    </div>
  )
}