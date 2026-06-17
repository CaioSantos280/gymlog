'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  Tooltip,
} from 'recharts'
import Link from 'next/link'

export default function DashboardPage() {
  const [data, setData] = useState<any[]>([])
  const [stats, setStats] = useState({
    diasAtivos: 0,
    totalTreinos: 0,
    mediaTreinosPorDia: "0",
    melhorDia: null as any,
    ultimoTreino: null as any,
  })

  async function buscarDados() {
    const { data: treinos, error } = await supabase
      .from('treinos')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      console.error("Erro ao buscar dados:", error)
      return
    }

    if (treinos && treinos.length > 0) {
      // 1. AGRUPAR VOLUME POR DIA
      const agrupado = treinos.reduce((acc: any, treino) => {
        // Garantindo que a data seja tratada como string local (DD/MM)
        const dateObj = new Date(treino.created_at)
        const dataFormatada = dateObj.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
        })

        // Se o nome da coluna no seu banco for 'carga_total' ou 'volume', ele pega o que existir
        const volumeTreino = Number(treino.volume || treino.carga_total || 0)

        acc[dataFormatada] = (acc[dataFormatada] || 0) + volumeTreino
        return acc
      }, {})

      // 2. FORMATAR PARA O GRÁFICO
      const chartData = Object.keys(agrupado).map((key) => ({
        data: key,
        volume: agrupado[key],
      }))

      setData(chartData)

      // 3. CÁLCULO DE ESTATÍSTICAS
      const diasUnicos = new Set(
        treinos.map((t: any) => new Date(t.created_at).toLocaleDateString('pt-BR'))
      )

      const diasAtivos = diasUnicos.size
      const totalTreinos = treinos.length
      
      // Média formatada como string para o toFixed não quebrar o estado
      const mediaTreinosPorDia = diasAtivos > 0 
        ? (totalTreinos / diasAtivos).toFixed(1) 
        : "0"

      const melhorDia = Object.entries(agrupado).sort(
        (a: any, b: any) => (b[1] as number) - (a[1] as number)
      )[0]

      const ultimoTreino = treinos[treinos.length - 1]

      setStats({
        diasAtivos,
        totalTreinos,
        mediaTreinosPorDia,
        melhorDia,
        ultimoTreino,
      })
    }
  }

  useEffect(() => {
    buscarDados()
  }, [])

  const volumeTotal = data.reduce((acc, curr) => acc + curr.volume, 0)
  const mediaVolume = data.length > 0 ? Math.round(volumeTotal / data.length) : 0

  return (
    <main className="min-h-screen bg-black text-white font-sans">
      <div className="max-w-md mx-auto px-4 py-8">
        
        {/* HEADER */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <p className="text-xs uppercase text-gray-500 tracking-widest mb-1">GymLog</p>
            <h1 className="text-3xl font-black">Dashboard</h1>
          </div>
          <Link href="/" className="text-sm text-gray-400 hover:text-white transition bg-white/5 px-4 py-2 rounded-full border border-white/10">
            Voltar
          </Link>
        </header>

        {/* VOLUME TOTAL */}
        <section className="mb-4">
          <div className="bg-[#111111] rounded-3xl p-6 border border-white/5 shadow-2xl">
            <p className="text-gray-500 text-sm mb-1">Volume Total Acumulado</p>
            <h2 className="text-5xl font-black tabular-nums">
              {volumeTotal.toLocaleString('pt-BR')}
              <span className="text-blue-500 text-2xl ml-2 uppercase">kg</span>
            </h2>
          </div>
        </section>

        {/* STATS GRID */}
        <section className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-[#111111] rounded-3xl p-5 border border-white/5">
            <p className="text-gray-500 text-xs mb-2">Dias Ativos</p>
            <h3 className="text-3xl font-black">{stats.diasAtivos}</h3>
          </div>
          <div className="bg-[#111111] rounded-3xl p-5 border border-white/5">
            <p className="text-gray-500 text-xs mb-2">Total Treinos</p>
            <h3 className="text-3xl font-black">{stats.totalTreinos}</h3>
          </div>
          <div className="bg-[#111111] rounded-3xl p-5 border border-white/5">
            <p className="text-gray-500 text-xs mb-2">Treinos / Dia</p>
            <h3 className="text-3xl font-black">{stats.mediaTreinosPorDia}</h3>
          </div>
          <div className="bg-[#111111] rounded-3xl p-5 border border-white/5">
            <p className="text-gray-500 text-xs mb-2">Média Volume</p>
            <h3 className="text-3xl font-black">
              {mediaVolume}
              <span className="text-sm text-blue-500 ml-1">kg</span>
            </h3>
          </div>
        </section>

        {/* MELHOR DIA */}
        <section className="mb-6">
          <div className="bg-[#111111] rounded-3xl p-5 border border-white/5">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-2">Recorde de Volume Diário</p>
            {stats.melhorDia ? (
              <div>
                <h2 className="text-3xl font-black text-blue-400">
                  {stats.melhorDia[1].toLocaleString('pt-BR')}
                  <span className="text-white ml-1 text-xl italic uppercase">kg</span>
                </h2>
                <p className="text-gray-500 text-sm mt-1">Conquistado em {stats.melhorDia[0]}</p>
              </div>
            ) : (
              <p className="text-gray-500">Aguardando dados...</p>
            )}
          </div>
        </section>

        {/* GRÁFICO DE EVOLUÇÃO */}
        <section className="bg-[#111111] rounded-3xl p-5 border border-white/5">
          <div className="mb-6">
            <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Evolução</p>
            <h2 className="text-xl font-bold">Progressão de Carga</h2>
          </div>

          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="blueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="data" 
                  tickLine={false} 
                  axisLine={false} 
                  tick={{ fill: '#666', fontSize: 12 }}
                  minTickGap={20}
                />
                <Tooltip
                  cursor={{ stroke: '#3b82f6', strokeWidth: 1 }}
                  contentStyle={{
                    background: '#111',
                    border: '1px solid #333',
                    borderRadius: '12px',
                    color: '#fff',
                    padding: '8px 12px'
                  }}
                  itemStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="volume"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#blueGradient)"
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>
    </main>
  )
}