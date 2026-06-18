'use client'

interface ResumoGeralProps {
  totalTreinos: number
  totalPrs: number
  primeiroTreinoData: string | null
}

export function ResumoGeral({ totalTreinos, totalPrs, primeiroTreinoData }: ResumoGeralProps) {
  return (
    <div className="bg-[#121212] rounded-xl border border-white/5 p-4 grid grid-cols-3 divide-x divide-white/5">
      <div className="text-center px-1">
        <p className="text-2xl font-black text-blue-400">{totalTreinos}</p>
        <p className="text-[10px] uppercase tracking-wide text-white/40 font-bold mt-0.5">
          Treinos
        </p>
      </div>
      <div className="text-center px-1">
        <p className="text-2xl font-black text-amber-400">{totalPrs}</p>
        <p className="text-[10px] uppercase tracking-wide text-white/40 font-bold mt-0.5">
          PRs
        </p>
      </div>
      <div className="text-center px-1">
        <p className="text-sm font-black text-white/80 mt-1.5">
          {primeiroTreinoData
            ? new Date(primeiroTreinoData).toLocaleDateString('pt-BR')
            : '—'}
        </p>
        <p className="text-[10px] uppercase tracking-wide text-white/40 font-bold mt-0.5">
          Início
        </p>
      </div>
    </div>
  )
}