'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function RecordesPage() {
  const [exercicio, setExercicio] = useState('')
  const [peso, setPeso] = useState('')
  const [lista, setLista] = useState<any[]>([])

  async function buscarRecordes() {
    const { data } = await supabase
      .from('recordes')
      .select('*')
      .order('peso', { ascending: false })
    if (data) setLista(data)
  }

  useEffect(() => { buscarRecordes() }, [])

  async function salvarPR(e: React.FormEvent) {
    e.preventDefault()
    if (!exercicio || !peso) return

    const { error } = await supabase.from('recordes').insert([
      { exercicio, peso: Number(peso) }
    ])

    if (!error) {
      setExercicio(''); setPeso('');
      buscarRecordes()
    }
  }

  async function excluirPR(id: string) {
    const confirmacao = window.confirm("Remover este recorde?")
    if (!confirmacao) return

    const { error } = await supabase.from('recordes').delete().eq('id', id)
    if (!error) buscarRecordes()
  }

  return (
    <main className="min-h-screen bg-black text-white p-4 pb-32 font-sans">
      <div className="max-w-md mx-auto pt-4">
        
        <header className="mb-6 px-2">
          <h1 className="text-4xl font-black italic text-yellow-500 leading-none uppercase tracking-tighter">Recordes</h1>
          <p className="text-gray-500 text-[10px] font-black tracking-[0.2em] mt-1 uppercase">Histórico de Cargas</p>
        </header>

        {/* FORMULÁRIO */}
        <form onSubmit={salvarPR} className="bg-[#111] p-5 rounded-[2.5rem] border border-white/5 mb-8 space-y-3 shadow-2xl">
          <input 
            type="text" 
            placeholder="Exercício (ex: Supino)" 
            value={exercicio} 
            onChange={e => setExercicio(e.target.value)} 
            className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 text-white text-base" 
          />
          <div className="flex gap-2">
            <input 
              type="number" 
              inputMode="decimal"
              placeholder="Peso (Kg)" 
              value={peso} 
              onChange={e => setPeso(e.target.value)} 
              className="w-full bg-black border border-white/10 p-4 rounded-2xl outline-none focus:border-yellow-500 text-white text-base"
            />
            <button className="bg-yellow-500 text-black font-black px-8 rounded-2xl uppercase text-xs active:scale-90 transition-all">
              ADD
            </button>
          </div>
        </form>

        {/* LISTA COM DATA E EXCLUIR */}
        <div className="space-y-3">
          {lista.map((pr) => (
            <div key={pr.id} className="bg-[#0a0a0a] border border-white/5 p-4 rounded-[2rem] flex justify-between items-center shadow-lg relative overflow-hidden">
              <div className="flex-1">
                <h4 className="font-black text-lg text-gray-100 uppercase tracking-tighter leading-none mb-1 truncate max-w-[140px]">
                  {pr.exercicio}
                </h4>
                {/* A DATA ESTÁ AQUI */}
                <p className="text-[10px] text-yellow-500/60 font-bold uppercase tracking-widest">
                  {new Date(pr.created_at).toLocaleDateString('pt-BR')}
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <div className="text-right mr-1">
                  <p className="text-2xl font-black text-white tabular-nums leading-none">
                    {pr.peso}<span className="text-[10px] text-gray-600 ml-0.5">KG</span>
                  </p>
                </div>
                
                <button 
                  onClick={() => excluirPR(pr.id)}
                  className="bg-white/5 text-gray-500 p-3 rounded-xl active:bg-red-500/20 active:text-red-500 transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                </button>
              </div>
            </div>
          ))}
          
          {lista.length === 0 && (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[2.5rem]">
              <p className="text-gray-600 text-xs font-bold uppercase tracking-widest opacity-50">Sem recordes</p>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}