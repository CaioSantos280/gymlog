import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export function TreinoForm({ onSave }: { onSave: () => void }) {
  const [exercicio, setExercicio] = useState('')
  const [series, setSeries] = useState('')
  const [reps, setReps] = useState('')
  const [peso, setPeso] = useState('')

  async function handleSalvar() {
    if (!exercicio || !series || !reps || !peso) return alert('Preencha tudo!')
    const { error } = await supabase.from('treinos').insert([
      { exercicio, series: Number(series), reps: Number(reps), peso: Number(peso) }
    ])
    if (!error) {
      setExercicio(''); setSeries(''); setReps(''); setPeso('')
      onSave()
    }
  }

  return (
    <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-2xl mb-6">
      <div className="grid grid-cols-2 gap-4">
        <input placeholder="Exercício" value={exercicio} onChange={e => setExercicio(e.target.value)} className="col-span-2 bg-[#1a1a1a] p-3 rounded-xl border border-white/10 outline-none focus:border-blue-500" />
        <input type="number" placeholder="Séries" value={series} onChange={e => setSeries(e.target.value)} className="bg-[#1a1a1a] p-3 rounded-xl border border-white/10 outline-none" />
        <input type="number" placeholder="Reps" value={reps} onChange={e => setReps(e.target.value)} className="bg-[#1a1a1a] p-3 rounded-xl border border-white/10 outline-none" />
        <input type="number" placeholder="Peso (kg)" value={peso} onChange={e => setPeso(e.target.value)} className="col-span-2 bg-[#1a1a1a] p-3 rounded-xl border border-white/10 outline-none" />
        <button onClick={handleSalvar} className="col-span-2 bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold transition-all active:scale-95">REGISTRAR</button>
      </div>
    </div>
  )
}