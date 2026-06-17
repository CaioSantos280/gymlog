import { supabase } from '@/lib/supabase'

interface TreinoCardProps {
  treino: any
  onDelete: () => void
}

export function TreinoCard({ treino, onDelete }: TreinoCardProps) {
  async function handleDeletar() {
    if(!confirm('Apagar registro?')) return
    const { error } = await supabase.from('treinos').delete().eq('id', treino.id)
    if (!error) onDelete()
  }

  return (
    <div className="bg-[#121212] p-5 rounded-xl border-l-4 border-blue-600 flex justify-between items-center group">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-bold text-lg capitalize">{treino.exercicio}</h3>
          <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded text-gray-500 font-medium">
            {new Date(treino.created_at).toLocaleDateString('pt-BR')}
          </span>
        </div>
        <p className="text-gray-400 text-sm">
          {treino.series} x {treino.reps} — <span className="text-blue-400 font-bold">{treino.peso}kg</span>
        </p>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="text-right">
          <p className="text-[9px] text-gray-500 uppercase font-black">Volume</p>
          <p className="text-xl font-black">{treino.carga_total}kg</p>
        </div>
        <button onClick={handleDeletar} className="text-gray-700 hover:text-red-500 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>
    </div>
  )
}