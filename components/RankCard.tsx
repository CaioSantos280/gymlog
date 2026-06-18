'use client'

import { useEffect, useState } from 'react'
import { calcularProgressoRank } from '@/lib/ranks'

export function RankCard({ xpAtual }: { xpAtual: number }) {
  const progresso = calcularProgressoRank(xpAtual)
  const [largura, setLargura] = useState(0)

  // Anima a barra de 0 até o percentual real após o primeiro render
  useEffect(() => {
    const t = setTimeout(() => setLargura(progresso.percentual), 150)
    return () => clearTimeout(t)
  }, [progresso.percentual])

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 p-6 shadow-2xl"
      style={{
        background: `radial-gradient(120% 140% at 0% 0%, ${progresso.atual.corGlow} 0%, #121212 55%)`,
      }}
    >
      {/* Selo do rank */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">
            Rank Atual
          </p>
          <h2
            className="text-3xl font-black italic tracking-tight"
            style={{ color: progresso.atual.cor, textShadow: `0 0 22px ${progresso.atual.corGlow}` }}
          >
            {progresso.atual.nome}
          </h2>
        </div>

        {progresso.proximo && (
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 font-bold mb-1">
              Próximo
            </p>
            <p className="text-sm font-bold text-white/60">{progresso.proximo.nome}</p>
          </div>
        )}
      </div>

      {/* Barra de XP */}
      <div className="mt-5">
        <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${largura}%`,
              background: progresso.atual.gradiente,
              boxShadow: `0 0 16px ${progresso.atual.corGlow}`,
            }}
          />
        </div>

        <div className="flex items-center justify-between mt-2">
          <p className="text-xs font-mono text-white/50">
            {progresso.xpNoRankAtual.toLocaleString('pt-BR')}
            {progresso.proximo && ` / ${progresso.xpNecessarioNoRank.toLocaleString('pt-BR')} XP`}
            {!progresso.proximo && ' XP — nível máximo'}
          </p>
          <p
            className="text-xs font-black"
            style={{ color: progresso.atual.cor }}
          >
            {progresso.percentual.toFixed(0)}%
          </p>
        </div>
      </div>
    </div>
  )
}