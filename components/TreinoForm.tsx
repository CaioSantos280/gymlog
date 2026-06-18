'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase' // Ajustado se usar caminhos relativos
import { processarNovoTreino } from '../lib/gamification' // Importando a lógica de XP

export function TreinoForm({ onSave }: { onSave: () => void }) {
  const [exercicio, setExercicio] = useState('')
  const [series, setSeries] = useState('')
  const [reps, setReps] = useState('')
  const [peso, setPeso] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function handleSalvar() {
    if (!exercicio || !series || !reps || !peso) {
      return alert('Preencha todos os campos do treino!')
    }

    setEnviando(true)

    // 1. Calcula a carga total (Series x Repetições x Peso) para a nova coluna do banco
    const cargaTotal = Number(series) * Number(reps) * Number(peso)
    const nomeExercicioLimpo = exercicio.trim()

    // 2. Salva o treino na tabela 'treinos' do Supabase
    const { data: novosTreinos, error: erroTreino } = await supabase
      .from('treinos')
      .insert([
        { 
          exercicio: nomeExercicioLimpo, 
          series: Number(series), 
          reps: Number(reps), 
          peso: Number(peso),
          carga_total: cargaTotal 
        }
      ])
      .select()

    if (erroTreino) {
      console.error('Erro ao salvar treino:', erroTreino.message)
      alert('Erro ao salvar no banco de dados.')
      setEnviando(false)
      return
    }

    // 3. Atualiza as regras de Gamificação (XP, Ranks, Streak e PR)
    if (novosTreinos && novosTreinos.length > 0) {
      const resultado = await processarNovoTreino({
        exercicio: nomeExercicioLimpo,
        peso: Number(peso),
        carga_total: cargaTotal
      })

      if (resultado) {
        // Alerta de conquistas na tela
        console.log(`Ganhou ${resultado.xpGanho} XP!`, resultado.detalheXp)
        
        if (resultado.ehNovoRecorde) {
          alert(`🏆 NOVO RECORDE PESSOAL (PR)! Você quebrou sua marca no ${nomeExercicioLimpo}!`)
        }
        
        if (resultado.rankSubiu) {
          alert(`🎉 UPAOU DE NÍVEL! Novo Rank: ${resultado.perfil.rank_nome}`)
        }
      }
    }

    // 4. Limpa o formulário e avisa a página para atualizar o dashboard
    setExercicio('')
    setSeries('')
    setReps('')
    setPeso('')
    setEnviando(false)
    onSave()
  }

  return (
    <div className="bg-[#121212] p-6 rounded-2xl border border-white/5 shadow-2xl mb-6">
      <div className="grid grid-cols-2 gap-4">
        <input 
          placeholder="Exercício (ex: Supino Reto)" 
          value={exercicio} 
          onChange={e => setExercicio(e.target.value)} 
          className="col-span-2 bg-[#1a1a1a] p-3 rounded-xl border border-white/10 outline-none focus:border-blue-500 text-white" 
        />
        <input 
          type="number" 
          placeholder="Séries" 
          value={series} 
          onChange={e => setSeries(e.target.value)} 
          className="bg-[#1a1a1a] p-3 rounded-xl border border-white/10 outline-none text-white focus:border-blue-500" 
        />
        <input 
          type="number" 
          placeholder="Reps" 
          value={reps} 
          onChange={e => setReps(e.target.value)} 
          className="bg-[#1a1a1a] p-3 rounded-xl border border-white/10 outline-none text-white focus:border-blue-500" 
        />
        <input 
          type="number" 
          placeholder="Peso (kg)" 
          value={peso} 
          onChange={e => setPeso(e.target.value)} 
          className="col-span-2 bg-[#1a1a1a] p-3 rounded-xl border border-white/10 outline-none text-white focus:border-blue-500" 
        />
        <button 
          onClick={handleSalvar} 
          disabled={enviando}
          className="col-span-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 py-4 rounded-xl font-bold transition-all active:scale-95 text-white uppercase tracking-wider"
        >
          {enviando ? 'REGISTRANDO...' : 'REGISTRAR'}
        </button>
      </div>
    </div>
  )
}