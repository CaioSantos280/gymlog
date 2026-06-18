'use client'

import { useState, useMemo } from 'react'
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts'

interface PontoPeso {
  created_at: string
  peso_kg: number
}

interface PontoTreino {
  created_at: string
  exercicio: string
  peso: number
}

interface EvolucaoChartProps {
  pesos: PontoPeso[]
  treinos: PontoTreino[]
}

const EXERCICIO_SUPINO = 'supino'

export function EvolucaoChart({ pesos, treinos }: EvolucaoChartProps) {
  const [modo, setModo] = useState<'peso' | 'supino'>('peso')

  const dadosPeso = useMemo(
    () =>
      pesos
        .slice()
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((p) => ({
          data: new Date(p.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          valor: p.peso_kg,
        })),
    [pesos]
  )

  const dadosSupino = useMemo(
    () =>
      treinos
        .filter((t) => t.exercicio?.toLowerCase().includes(EXERCICIO_SUPINO))
        .slice()
        .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
        .map((t) => ({
          data: new Date(t.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }),
          valor: t.peso,
        })),
    [treinos]
  )

  const dados = modo === 'peso' ? dadosPeso : dadosSupino
  const cor = modo === 'peso' ? '#5AC8FA' : '#FF4D6A'

  return (
    <div className="bg-[#121212] rounded-xl border border-white/5 p-4">
      <div className="flex items-center justify-between mb-2">
        <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold">
          Evolução
        </p>
        <div className="flex gap-1 bg-white/5 rounded-lg p-0.5">
          <button
            onClick={() => setModo('peso')}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${
              modo === 'peso' ? 'bg-white/10 text-white' : 'text-white/40'
            }`}
          >
            Peso
          </button>
          <button
            onClick={() => setModo('supino')}
            className={`text-[11px] font-bold px-2.5 py-1 rounded-md transition-all ${
              modo === 'supino' ? 'bg-white/10 text-white' : 'text-white/40'
            }`}
          >
            Supino
          </button>
        </div>
      </div>

      {dados.length > 1 ? (
        <div className="h-36 -ml-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={dados} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="corEvolucao" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={cor} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={cor} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis
                dataKey="data"
                tick={{ fill: '#666', fontSize: 10 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide domain={['auto', 'auto']} />
              <Tooltip
                contentStyle={{
                  background: '#1a1a1a',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: 8,
                  fontSize: 12,
                }}
                labelStyle={{ color: '#999' }}
                formatter={(value: any, name: any) => [`${value} kg`, modo === 'peso' ? 'Peso' : 'Supino']}
              />
              <Area
                type="monotone"
                dataKey="valor"
                stroke={cor}
                strokeWidth={2}
                fill="url(#corEvolucao)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="h-36 flex items-center justify-center">
          <p className="text-xs text-white/30 italic text-center px-4">
            {modo === 'peso'
              ? 'Registre seu peso corporal para ver a evolução aqui.'
              : 'Registre treinos de supino para ver a evolução aqui.'}
          </p>
        </div>
      )}
    </div>
  )
}