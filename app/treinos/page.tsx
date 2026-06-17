'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'

import {
  Trash2,
  Check,
  X,
  Dumbbell,
  Plus,
  GripVertical,
  ChevronDown,
  ChevronUp,
  Edit2
} from 'lucide-react'

type Exercicio = {
  id: string
  nome_ficha: string
  exercicio: string
  grupo_muscular: string
  series_reps: string
  ordem: number
  descricao_ficha?: string
}

const gruposMusculares = {
  Peito: ['Peito Superior', 'Peito Médio', 'Peito Inferior'],
  Costas: ['Dorsais (Largura)', 'Costas Média (Espessura)', 'Lombar', 'Trapézio'],
  Ombros: ['Deltoide Frontal', 'Deltoide Lateral', 'Deltoide Posterior'],
  Braços: ['Bíceps', 'Tríceps', 'Antebraço'],
  Pernas: ['Quadríceps', 'Posterior de Coxa', 'Glúteos', 'Panturrilhas', 'Adutores'],
  Core: ['Abdômen', 'Oblíquos'],
}

export default function FichaTreinoPage() {
  const [nomeFicha, setNomeFicha] = useState('Treino A')
  const [exercicio, setExercicio] = useState('')
  const [grupo, setGrupo] = useState('Peito Superior')
  const [series, setSeries] = useState('')

  const [lista, setLista] = useState<Exercicio[]>([])
  const [loading, setLoading] = useState(true)

  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNome, setEditNome] = useState('')
  const [editSeries, setEditSeries] = useState('')
  const [editGrupo, setEditGrupo] = useState('')

  const [editandoFicha, setEditandoFicha] = useState<string | null>(null)
  const [novaDescricaoFicha, setNovaDescricaoFicha] = useState('')

  const [fichasAbertas, setFichasAbertas] = useState<string[]>(['Treino A'])

  const toggleFicha = (titulo: string) => {
    setFichasAbertas(prev => 
      prev.includes(titulo) ? prev.filter(t => t !== titulo) : [...prev, titulo]
    )
  }

  async function buscarFicha() {
    setLoading(true)
    const { data, error } = await supabase
      .from('rotinas')
      .select('*')
      .order('nome_ficha', { ascending: true })
      .order('ordem', { ascending: true })

    if (!error) setLista(data || [])
    setLoading(false)
  }

  useEffect(() => { buscarFicha() }, [])

  async function apagarCategoria(titulo: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!window.confirm(`Deseja apagar todos os exercícios do ${titulo}?`)) return
    const { error } = await supabase.from('rotinas').delete().eq('nome_ficha', titulo)
    if (!error) buscarFicha()
  }

  async function salvarDescricaoFicha(titulo: string, e: React.MouseEvent) {
    e.stopPropagation()
    const { error } = await supabase
      .from('rotinas')
      .update({ descricao_ficha: novaDescricaoFicha })
      .eq('nome_ficha', titulo)

    if (!error) {
      setEditandoFicha(null)
      buscarFicha()
    }
  }

  const onDragEnd = async (result: any) => {
    if (!result.destination) return
    const fichaId = result.source.droppableId
    const novaListaGeral = [...lista]
    const itensDaFicha = novaListaGeral.filter(i => i.nome_ficha === fichaId)
    const [removido] = itensDaFicha.splice(result.source.index, 1)
    itensDaFicha.splice(result.destination.index, 0, removido)

    const listaAtualizada = [
      ...novaListaGeral.filter(i => i.nome_ficha !== fichaId),
      ...itensDaFicha
    ]
    setLista(listaAtualizada)

    try {
      const updates = itensDaFicha.map((item, index) => 
        supabase.from('rotinas').update({ ordem: index }).eq('id', item.id)
      )
      await Promise.all(updates)
    } catch (err) { buscarFicha() }
  }

  async function adicionarAFicha(e: React.FormEvent) {
    e.preventDefault()
    if (!exercicio.trim()) return
    const ultimaOrdem = lista.filter(i => i.nome_ficha === nomeFicha).length
    const descExistente = lista.find(i => i.nome_ficha === nomeFicha)?.descricao_ficha

    const { error } = await supabase.from('rotinas').insert([{
        nome_ficha: nomeFicha, exercicio: exercicio.trim(), grupo_muscular: grupo,
        series_reps: series.trim(), ordem: ultimaOrdem, descricao_ficha: descExistente
    }])
    if (!error) { setExercicio(''); setSeries(''); buscarFicha() }
  }

  async function salvarEdicao(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    const { error } = await supabase.from('rotinas').update({
        exercicio: editNome, series_reps: editSeries, grupo_muscular: editGrupo
    }).eq('id', id)
    if (!error) { setEditandoId(null); buscarFicha() }
  }

  async function removerDaFicha(id: string, e: React.MouseEvent) {
    e.stopPropagation()
    if (!window.confirm('Remover exercício?')) return
    const { error } = await supabase.from('rotinas').delete().eq('id', id)
    if (!error) buscarFicha()
  }

  const fichasAgrupadas = useMemo(() => {
    return lista.reduce((acc: Record<string, Exercicio[]>, item) => {
      if (!acc[item.nome_ficha]) acc[item.nome_ficha] = []
      acc[item.nome_ficha].push(item)
      return acc
    }, {})
  }, [lista])

  return (
    <main className="min-h-screen bg-black text-white p-4 pb-32 font-sans selection:bg-blue-500/30">
      <div className="max-w-md mx-auto pt-4">
        
        <header className="mb-8 px-2 flex justify-between items-center">
          <div className="flex flex-col">
            <h1 className="text-5xl font-black italic text-blue-500 leading-none uppercase tracking-tighter">ROTINA</h1>
            <p className="text-gray-600 text-[8px] font-black tracking-[0.4em] mt-1 uppercase italic pl-1">Performance Tracker</p>
          </div>
          <div className="bg-blue-500/10 p-3 rounded-2xl border border-blue-500/20">
            <Dumbbell className="text-blue-500" size={22} />
          </div>
        </header>

        {/* FORM ADICIONAR */}
        <form onSubmit={adicionarAFicha} className="bg-[#0c0c0c] border border-white/[0.05] p-5 rounded-[2rem] mb-10 shadow-2xl space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <select value={nomeFicha} onChange={(e) => setNomeFicha(e.target.value)} className="w-full bg-black border border-white/10 p-3.5 rounded-xl text-[11px] font-bold text-blue-500 outline-none appearance-none">
              <option>Treino A</option><option>Treino B</option><option>Treino C</option>
            </select>
            <select value={grupo} onChange={(e) => setGrupo(e.target.value)} className="w-full bg-black border border-white/10 p-3.5 rounded-xl text-[11px] font-bold text-gray-400 outline-none appearance-none">
              {Object.entries(gruposMusculares).map(([categoria, itens]) => (
                <optgroup key={categoria} label={categoria} className="bg-[#111]">
                  {itens.map(i => <option key={i} value={i}>{i}</option>)}
                </optgroup>
              ))}
            </select>
          </div>
          <input type="text" placeholder="Nome do exercício" value={exercicio} onChange={(e) => setExercicio(e.target.value)} className="w-full bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500/50 text-white text-sm" />
          <div className="grid grid-cols-5 gap-2">
            <input type="text" placeholder="Séries x Reps" value={series} onChange={(e) => setSeries(e.target.value)} className="col-span-4 bg-black border border-white/10 p-4 rounded-xl outline-none focus:border-blue-500/50 text-white text-sm font-mono" />
            <button type="submit" className="bg-blue-600 active:bg-blue-700 active:scale-95 transition-all text-white rounded-xl flex items-center justify-center"><Plus size={24} strokeWidth={3} /></button>
          </div>
        </form>

        <DragDropContext onDragEnd={onDragEnd}>
          <div className="space-y-6">
            {!loading && Object.keys(fichasAgrupadas).map((titulo) => {
              const isExpanded = fichasAbertas.includes(titulo);
              const descricao = fichasAgrupadas[titulo][0]?.descricao_ficha || "Definir músculos";
              
              return (
                <div key={titulo} className="bg-[#0c0c0c]/50 rounded-[2.5rem] border border-white/[0.02] overflow-hidden">
                  <div 
                    onClick={() => toggleFicha(titulo)}
                    className="p-6 cursor-pointer active:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-3">
                            <div className={`w-1 h-6 rounded-full transition-colors ${isExpanded ? 'bg-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'bg-gray-800'}`} />
                            <h2 className={`text-2xl font-black italic uppercase tracking-tight ${isExpanded ? 'text-white' : 'text-gray-500'}`}>
                                {titulo}
                            </h2>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-gray-600 bg-white/5 px-3 py-1 rounded-full">
                                {fichasAgrupadas[titulo].length} ITENS
                            </span>
                            <button onClick={(e) => apagarCategoria(titulo, e)} className="p-2 text-gray-700 active:text-red-500 transition-colors"><Trash2 size={16} /></button>
                            {isExpanded ? <ChevronUp size={20} className="text-blue-500" /> : <ChevronDown size={20} className="text-gray-600" />}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 pl-4">
                        {editandoFicha === titulo ? (
                            <div className="flex gap-2 w-full items-center" onClick={(e) => e.stopPropagation()}>
                                <input 
                                    value={novaDescricaoFicha} 
                                    onChange={(e) => setNovaDescricaoFicha(e.target.value)}
                                    placeholder="Ex: Peito, Tríceps..."
                                    className="bg-black border border-blue-500/30 rounded-lg px-2 py-1 text-[11px] w-full outline-none text-blue-400"
                                    autoFocus
                                />
                                <button onClick={(e) => salvarDescricaoFicha(titulo, e)} className="text-blue-500 p-2 bg-blue-500/10 rounded-md active:scale-90"><Check size={16}/></button>
                                <button onClick={(e) => { e.stopPropagation(); setEditandoFicha(null); }} className="text-gray-500 p-2"><X size={16}/></button>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2">
                                <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest truncate max-w-[200px]">
                                    {descricao}
                                </p>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); setEditandoFicha(titulo); setNovaDescricaoFicha(descricao); }}
                                    className="text-gray-700 p-1 opacity-60 active:opacity-100"
                                >
                                    <Edit2 size={10} />
                                </button>
                            </div>
                        )}
                    </div>
                  </div>

                  {isExpanded && (
                    <Droppable droppableId={titulo}>
                      {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className="px-4 pb-6 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
                          {fichasAgrupadas[titulo].map((item, index) => (
                            <Draggable key={item.id} draggableId={item.id.toString()} index={index}>
                              {(provided, snapshot) => (
                                <div ref={provided.innerRef} {...provided.draggableProps} className={`group bg-[#080808] border ${snapshot.isDragging ? 'border-blue-600 z-50 scale-[1.02]' : 'border-white/[0.04]'} p-4 rounded-[1.5rem] flex items-center transition-all active:border-white/10`}>
                                  <div {...provided.dragHandleProps} className="pr-4 text-gray-800 active:text-blue-500 p-2 touch-none"><GripVertical size={20} /></div>
                                  <div className="flex-1 min-w-0">
                                    {editandoId === item.id ? (
                                      <div className="space-y-2" onClick={(e) => e.stopPropagation()}>
                                        <input value={editNome} onChange={(e) => setEditNome(e.target.value)} className="bg-black border border-blue-500/50 rounded-lg px-3 py-2 text-sm w-full outline-none text-white" autoFocus />
                                        <div className="flex gap-2">
                                          <select value={editGrupo} onChange={(e) => setEditGrupo(e.target.value)} className="bg-black border border-white/10 rounded-lg px-2 py-2 text-[10px] w-full text-blue-400 outline-none">
                                            {Object.values(gruposMusculares).flat().map(g => <option key={g} value={g}>{g}</option>)}
                                          </select>
                                          <button onClick={(e) => salvarEdicao(item.id, e)} className="bg-blue-600 p-2 rounded-lg active:bg-blue-700"><Check size={18}/></button>
                                          <button onClick={(e) => { e.stopPropagation(); setEditandoId(null); }} className="bg-white/10 p-2 rounded-lg active:bg-white/20"><X size={18}/></button>
                                        </div>
                                      </div>
                                    ) : (
                                      <div onClick={() => { setEditandoId(item.id); setEditNome(item.exercicio); setEditSeries(item.series_reps); setEditGrupo(item.grupo_muscular); }} className="active:opacity-70 transition-opacity">
                                        <span className="text-[7px] font-black uppercase text-blue-500/70 block mb-0.5">{item.grupo_muscular}</span>
                                        <h4 className="font-bold text-gray-200 text-sm uppercase truncate">{item.exercicio}</h4>
                                        <p className="text-[10px] font-medium text-gray-600 mt-0.5 italic">{item.series_reps}</p>
                                      </div>
                                    )}
                                  </div>
                                  <button onClick={(e) => removerDaFicha(item.id, e)} className="ml-2 p-3 text-gray-800 active:text-red-500"><Trash2 size={18} /></button>
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  )}
                </div>
              );
            })}
          </div>
        </DragDropContext>
      </div>
    </main>
  )
}