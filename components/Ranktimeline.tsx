'use client'

import { RANKS } from '@/lib/ranks'

interface RankTimelineProps {
  xpAtual: number
}

export function RankTimeline({ xpAtual }: RankTimelineProps) {
  const indiceAtual = (() => {
    let idx = 0
    RANKS.forEach((r, i) => {
      if (xpAtual >= r.xpMin) idx = i
    })
    return idx
  })()

  return (
    <div>
      <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-3 px-1">
        Histórico de Ranks
      </p>
      <div className="bg-[#121212] rounded-xl border border-white/5 p-4 overflow-x-auto">
        <div className="flex items-center gap-0 min-w-max">
          {RANKS.map((rank, i) => {
            const conquistado = i <= indiceAtual
            const ehAtual = i === indiceAtual

            return (
              <div key={rank.nome} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5 w-[64px]">
                  <div
                    className="w-3.5 h-3.5 rounded-full border-2 transition-all"
                    style={{
                      background: conquistado ? rank.cor : 'transparent',
                      borderColor: conquistado ? rank.cor : 'rgba(255,255,255,0.15)',
                      boxShadow: ehAtual ? `0 0 10px ${rank.corGlow}` : undefined,
                    }}
                  />
                  <p
                    className={`text-[9px] font-bold text-center leading-tight ${
                      conquistado ? 'text-white/80' : 'text-white/25'
                    }`}
                  >
                    {rank.nome}
                  </p>
                </div>
                {i < RANKS.length - 1 && (
                  <div
                    className="h-[2px] w-6"
                    style={{
                      background: i < indiceAtual ? rank.cor : 'rgba(255,255,255,0.1)',
                    }}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}