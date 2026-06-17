'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function DietaForm({ onSave }: { onSave: () => void }) {
  const [refeicao, setRefeicao] = useState('')
  const [alimento, setAlimento] = useState('')
  const [kcal, setKcal] = useState('')
  const [proteina, setProteina] = useState('')
  const [carbo, setCarbo] = useState('')
  const [gordura, setGordura] = useState('')

  async function salvar(e: React.FormEvent) {
    e.preventDefault()
    if (!alimento || !refeicao) return

    const { error } = await supabase.from('dieta').insert([
      { 
        refeicao,
        alimento, 
        kcal: Number(kcal) || 0,
        proteina: Number(proteina) || 0,
        carbo: Number(carbo) || 0,
        gordura: Number(gordura) || 0
      }
    ])

    if (!error) {
      setRefeicao(''); setAlimento(''); setKcal(''); setProteina(''); setCarbo(''); setGordura('')
      onSave()
    }
  }

  return (
    <form onSubmit={salvar} className="bg-[#111] p-6 rounded-3xl border border-white/5 space-y-3">
      <input type="text" placeholder="Qual refeição? (Ex: Almoço)" value={refeicao} onChange={e => setRefeicao(e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 text-white" />
      <input type="text" placeholder="O que comeu?" value={alimento} onChange={e => setAlimento(e.target.value)} className="w-full bg-black/50 border border-white/10 p-3 rounded-xl outline-none focus:border-blue-500 text-white" />
      
      <div className="grid grid-cols-4 gap-2">
        <input type="number" placeholder="Kcal" value={kcal} onChange={e => setKcal(e.target.value)} className="bg-black/50 border border-white/10 p-2 rounded-xl text-xs text-white" />
        <input type="number" placeholder="P (g)" value={proteina} onChange={e => setProteina(e.target.value)} className="bg-black/50 border border-white/10 p-2 rounded-xl text-xs text-white" />
        <input type="number" placeholder="C (g)" value={carbo} onChange={e => setCarbo(e.target.value)} className="bg-black/50 border border-white/10 p-2 rounded-xl text-xs text-white" />
        <input type="number" placeholder="G (g)" value={gordura} onChange={e => setGordura(e.target.value)} className="bg-black/50 border border-white/10 p-2 rounded-xl text-xs text-white" />
      </div>

      <button className="w-full bg-blue-600 py-3 rounded-xl font-bold uppercase text-xs mt-2">Salvar</button>
    </form>
  )
}