'use client'

interface Pr {
  exercicio: string
  carga: number
  created_at: string
}

interface PerfilRecordesProps {
  prs: Pr[]
}

const EXERCICIOS_PRINCIPAIS = ['supino', 'agachamento', 'terra', 'leg press']

function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
}

export function PerfilRecordes({ prs }: PerfilRecordesProps) {
  // Para cada exercício, mantém apenas o PR de maior carga
  const melhoresPorExercicio = new Map<string, Pr>()
  for (const pr of prs) {
    const existente = melhoresPorExercicio.get(pr.exercicio)
    if (!existente || pr.carga > existente.carga) {
      melhoresPorExercicio.set(pr.exercicio, pr)
    }
  }

  const todos = Array.from(melhoresPorExercicio.values())

  const principais = EXERCICIOS_PRINCIPAIS
    .map((nome) => todos.find((pr) => normalizar(pr.exercicio).includes(nome)))
    .filter((pr): pr is Pr => Boolean(pr))

  const principaisIds = new Set(principais.map((pr) => pr.exercicio))
  const outros = todos
    .filter((pr) => !principaisIds.has(pr.exercicio))
    .sort((a, b) => b.carga - a.carga)

  if (todos.length === 0) {
    return (
      <div>
        <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-3 px-1">
          Recordes Pessoais
        </p>
        <div className="bg-[#121212] rounded-xl border border-white/5 p-6 text-center">
          <p className="text-xs text-white/30 italic">Nenhum PR registrado ainda.</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-3 px-1">
        Recordes Pessoais
      </p>

      {principais.length > 0 && (
        <div className="grid grid-cols-2 gap-2.5 mb-2.5">
          {principais.map((pr) => (
            <div
              key={pr.exercicio}
              className="bg-[#121212] rounded-xl border border-white/5 p-3.5 flex flex-col gap-0.5"
            >
              <p className="text-[10px] uppercase tracking-wide text-white/40 font-bold truncate">
                {pr.exercicio}
              </p>
              <p className="text-xl font-black text-amber-400">{pr.carga}kg</p>
            </div>
          ))}
        </div>
      )}

      {outros.length > 0 && (
        <div className="bg-[#121212] rounded-xl border border-white/5 divide-y divide-white/5">
          {outros.map((pr) => (
            <div key={pr.exercicio} className="flex items-center justify-between p-3">
              <p className="text-sm font-medium text-white/80 truncate">{pr.exercicio}</p>
              <p className="text-sm font-black text-amber-400 shrink-0 ml-3">{pr.carga}kg</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}