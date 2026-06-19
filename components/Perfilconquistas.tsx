'use client'

interface Conquista {
  id: string
  icone: string
  titulo: string
  descricao: string
  desbloqueada: boolean
}

function gerarConquistas(params: {
  totalTreinos: number
  totalPrs: number
  streakDias: number
  xpAtual: number
}): Conquista[] {
  const { totalTreinos, totalPrs, streakDias, xpAtual } = params

  return [
    { id: 'primeiro-treino', icone: '🎯', titulo: 'Primeiro Passo', descricao: 'Registre seu primeiro treino', desbloqueada: totalTreinos >= 1 },
    { id: 'treinos-10', icone: '📈', titulo: 'Constância', descricao: '10 treinos registrados', desbloqueada: totalTreinos >= 10 },
    { id: 'treinos-50', icone: '🏗️', titulo: 'Disciplina', descricao: '50 treinos registrados', desbloqueada: totalTreinos >= 50 },
    { id: 'treinos-100', icone: '🏛️', titulo: 'Veterano', descricao: '100 treinos registrados', desbloqueada: totalTreinos >= 100 },
    { id: 'primeiro-pr', icone: '🏆', titulo: 'Quebrando Limites', descricao: 'Conquiste seu primeiro PR', desbloqueada: totalPrs >= 1 },
    { id: 'prs-10', icone: '💪', titulo: 'Recordista', descricao: '10 PRs conquistados', desbloqueada: totalPrs >= 10 },
    { id: 'streak-7', icone: '🔥', titulo: 'Semana de Fogo', descricao: '7 dias seguidos treinando', desbloqueada: streakDias >= 7 },
    { id: 'streak-30', icone: '🌋', titulo: 'Imparável', descricao: '30 dias seguidos treinando', desbloqueada: streakDias >= 30 },
    { id: 'streak-100', icone: '☀️', titulo: 'Lenda Viva', descricao: '100 dias seguidos treinando', desbloqueada: streakDias >= 100 },
    { id: 'xp-10000', icone: '🥇', titulo: 'Ouro Conquistado', descricao: 'Alcance 10.000 XP', desbloqueada: xpAtual >= 10000 },
    { id: 'xp-100000', icone: '💎', titulo: 'Esmeralda Lendária', descricao: 'Alcance 100.000 XP', desbloqueada: xpAtual >= 100000 },
  ]
}

export function PerfilConquistas(params: {
  totalTreinos: number
  totalPrs: number
  streakDias: number
  xpAtual: number
}) {
  const conquistas = gerarConquistas(params)
  const desbloqueadas = conquistas.filter((c) => c.desbloqueada).length

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-3 px-1">
        Conquistas ({desbloqueadas}/{conquistas.length})
      </p>
      <div className="bg-[#121212] rounded-xl border border-white/5 divide-y divide-white/5">
        {conquistas.map((c) => (
          <div
            key={c.id}
            className={`flex items-center gap-3 p-3 ${!c.desbloqueada ? 'opacity-40' : ''}`}
          >
            <span className="text-xl shrink-0">{c.desbloqueada ? c.icone : '🔒'}</span>
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{c.titulo}</p>
              <p className="text-[11px] text-white/40 truncate">{c.descricao}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}