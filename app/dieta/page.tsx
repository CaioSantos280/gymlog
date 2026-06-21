'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DietaForm } from '@/components/DietaForm'

export default function DietaPage() {
  const [itens, setItens] = useState<any[]>([])

  async function buscarHistoricoDieta() {
    // 🔒 Pega o usuário ativo para filtrar os dados
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data, error } = await supabase
      .from('dieta')
      .select('*')
      .eq('user_id', user.id) // 🔒 Filtro privado
      .order('created_at', { ascending: false })

    if (data) setItens(data)
  }

  useEffect(() => { buscarHistoricoDieta() }, [])

  // 1. LÓGICA PARA O CONTADOR GIGANTE DE HOJE
  const hojeStr = new Date().toLocaleDateString('pt-BR')
  const dadosHoje = itens.filter(item => 
    new Date(item.created_at).toLocaleDateString('pt-BR') === hojeStr
  )

  const totaisHoje = dadosHoje.reduce((acc, curr) => ({
    k: acc.k + (Number(curr.kcal) || 0),
    p: acc.p + (Number(curr.proteina) || 0),
    c: acc.c + (Number(curr.carbo) || 0),
    g: acc.g + (Number(curr.gordura) || 0)
  }), { k: 0, p: 0, c: 0, g: 0 })

  // 2. LÓGICA DO HISTÓRICO AGRUPADO
  const diasAgrupados = itens.reduce((acc: any, item: any) => {
    const dataRef = new Date(item.created_at).toLocaleDateString('pt-BR')
    if (!acc[dataRef]) acc[dataRef] = { refeicoes: [], totais: { k: 0, p: 0, c: 0, g: 0 } }
    
    acc[dataRef].refeicoes.push(item)
    acc[dataRef].totais.k += Number(item.kcal) || 0
    acc[dataRef].totais.p += Number(item.proteina) || 0
    acc[dataRef].totais.c += Number(item.carbo) || 0
    acc[dataRef].totais.g += Number(item.gordura) || 0
    
    return acc
  }, {})

  return (
    <main className="min-h-screen bg-black text-white p-6 pb-24">
      <div className="max-w-md mx-auto py-6">
        
        <header className="mb-8">
          <h1 className="text-3xl font-black italic text-blue-500">DIÁRIO DE HOJE</h1>
          <p className="text-gray-500 text-sm">Acompanhe seus macros em tempo real.</p>
        </header>

        {/* O CONTADOR GIGANTE (ESTILO ANTIGO) */}
        <div className="bg-[#111] border border-white/5 p-6 rounded-[2.5rem] mb-8 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
          
          <div className="relative z-10">
            <p className="text-gray-500 text-xs uppercase font-black tracking-[0.2em] mb-2">Total de Calorias</p>
            <h2 className="text-5xl font-black text-white tabular-nums mb-6">
              {totaisHoje.k} <span className="text-blue-500 text-xl font-medium">kcal</span>
            </h2>
            
            <div className="grid grid-cols-3 gap-2 border-t border-white/10 pt-6">
              <div className="bg-white/5 p-3 rounded-2xl text-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Proteína</p>
                <p className="font-black text-lg text-blue-400">{totaisHoje.p}g</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl text-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Carbos</p>
                <p className="font-black text-lg text-green-400">{totaisHoje.c}g</p>
              </div>
              <div className="bg-white/5 p-3 rounded-2xl text-center">
                <p className="text-[10px] text-gray-500 uppercase font-bold mb-1">Gordura</p>
                <p className="font-black text-lg text-yellow-400">{totaisHoje.g}g</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <DietaForm onSave={buscarHistoricoDieta} />
        </div>

        {/* HISTÓRICO COM RESUMO DE MACROS EM CARDS MENORES */}
        <div className="space-y-10">
          <h3 className="text-gray-500 text-xs uppercase font-black tracking-widest px-2 text-center">Histórico Diário</h3>
          
          {Object.keys(diasAgrupados).map((data) => (
            <section key={data} className="border-l-2 border-blue-500/30 pl-4">
              
              {/* CABEÇALHO DO DIA */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-black text-white">
                    {data === hojeStr ? "Hoje" : data}
                  </h3>

                  {data !== hojeStr && (
                    <button
                      onClick={() => {
                        console.log("Editar dia:", data)
                      }}
                      className="text-xs bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg font-bold transition"
                    >
                      Editar
                    </button>
                  )}
                </div>

                <span className="text-[10px] bg-blue-500 text-white px-2 py-1 rounded-md font-bold">
                  {diasAgrupados[data].totais.k} kcal
                </span>
              </div>

              {/* RESUMO DE MACROS DO DIA */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="bg-[#111] p-2 rounded-xl text-center border border-white/5">
                  <p className="text-[8px] text-gray-500 uppercase">Prot</p>
                  <p className="text-xs font-bold">{diasAgrupados[data].totais.p}g</p>
                </div>
                <div className="bg-[#111] p-2 rounded-xl text-center border border-white/5">
                  <p className="text-[8px] text-gray-500 uppercase">Carb</p>
                  <p className="text-xs font-bold">{diasAgrupados[data].totais.c}g</p>
                </div>
                <div className="bg-[#111] p-2 rounded-xl text-center border border-white/5">
                  <p className="text-[8px] text-gray-500 uppercase">Gord</p>
                  <p className="text-xs font-bold">{diasAgrupados[data].totais.g}g</p>
                </div>
              </div>

              {/* LISTA DE REFEIÇÕES DAQUELA DATA */}
              <div className="space-y-2">
                {diasAgrupados[data].refeicoes.map((i: any) => (
                  <div key={i.id} className="bg-[#0a0a0a] border border-white/5 p-3 rounded-2xl flex justify-between items-center hover:border-blue-500/20 transition-all">
                    <div>
                      <p className="text-[9px] text-blue-500 font-bold uppercase">{i.refeicao}</p>
                      <h4 className="text-sm font-bold">{i.alimento}</h4>
                    </div>
                    <p className="text-sm font-black">{i.kcal} <span className="text-[8px] text-gray-500">kcal</span></p>
                  </div>
                ))}
              </div>

            </section>
          ))}
        </div>
      </div>
    </main>
  )
}