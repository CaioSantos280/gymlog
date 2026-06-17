'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { TreinoForm } from '@/components/TreinoForm'
import { TreinoCard } from '@/components/TreinoCard'
// 💡 REMOVIDO: import Link from "next/link" (Não estava sendo usado)

// Definindo uma interface simples para o TypeScript te ajudar no autocomplete
interface Treino {
  id: string | number
  exercicio: string
  created_at: string
  // adicione outros campos aqui se precisar (ex: carga, repeticoes)
}

export default function Home() {
  const [treinos, setTreinos] = useState<Treino[]>([]) // 💡 Tipado como Treino[] em vez de any[]
  const [busca, setBusca] = useState('') 

  async function buscarTreinos() {
    const { data, error } = await supabase
      .from('treinos')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) {
      console.error('Erro ao buscar treinos:', error.message)
      return
    }

    if (data) setTreinos(data as Treino[])
  }

  useEffect(() => { 
    buscarTreinos() 
  }, [])

  // Lógica do filtro
  const treinosFiltrados = treinos.filter((t) =>
    t.exercicio?.toLowerCase().includes(busca.toLowerCase())
  )

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-6 font-sans">
      <div className="max-w-xl mx-auto py-10">
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-black text-blue-500 italic tracking-tighter">
              GYMLOG
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track your progress.
            </p>
          </div>
        </header>

        {/* Componente do Formulário */}
        <TreinoForm onSave={buscarTreinos} />

        {/* Input de Busca */}
        <div className="relative my-8">
          <input 
            type="text"
            placeholder="🔍 Buscar no seu histórico..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)} 
            className="w-full bg-transparent border-b border-white/10 py-3 outline-none focus:border-blue-500 transition-all text-sm"
          />
          {busca && (
             <button 
               onClick={() => setBusca('')} 
               className="absolute right-2 top-3 text-gray-500 hover:text-white"
             >
               Limpar
             </button>
          )}
        </div>

        {/* Lista usando o resultado filtrado */}
        <div className="space-y-4">
          {treinosFiltrados.length > 0 ? (
            treinosFiltrados.map((t) => (
              <TreinoCard key={t.id} treino={t} onDelete={buscarTreinos} />
            ))
          ) : (
            <p className="text-center text-gray-600 py-10 italic">
              {busca ? 'Nenhum exercício encontrado...' : 'Nenhum treino registrado.'}
            </p>
          )}
        </div>
      </div>
    </main>
  )
}