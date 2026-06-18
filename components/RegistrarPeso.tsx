'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function RegistrarPeso({ onSave }: { onSave: () => void }) {
  const [aberto, setAberto] = useState(false)
  const [peso, setPeso] = useState('')
  const [salvando, setSalvando] = useState(false)

  async function handleSalvar() {
    if (!peso) return
    setSalvando(true)
    const { error } = await supabase.from('pesos').insert([{ peso_kg: Number(peso) }])
    setSalvando(false)
    if (!error) {
      setPeso('')
      setAberto(false)
      onSave()
    }
  }

  if (!aberto) {
    return (
      <button
        onClick={() => setAberto(true)}
        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 transition-colors"
      >
        + Registrar peso
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <input
        type="number"
        autoFocus
        placeholder="kg"
        value={peso}
        onChange={(e) => setPeso(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSalvar()}
        className="w-20 bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1 text-sm outline-none focus:border-blue-500"
      />
      <button
        onClick={handleSalvar}
        disabled={salvando}
        className="text-[11px] font-bold text-blue-400 hover:text-blue-300 disabled:opacity-40"
      >
        Salvar
      </button>
      <button
        onClick={() => setAberto(false)}
        className="text-[11px] font-bold text-white/30 hover:text-white/60"
      >
        Cancelar
      </button>
    </div>
  )
}