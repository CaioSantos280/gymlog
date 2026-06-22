'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function ResetSenhaPage() {
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.updateUser({
      password: password
    })

    if (error) {
      setMessage(`Erro: ${error.message}`)
    } else {
      setMessage('Senha alterada com sucesso! Redirecionando...')
      setTimeout(() => router.push('/login'), 2000)
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="w-full max-w-md bg-[#111111] p-8 rounded-2xl border border-white/10">
        <h1 className="text-xl font-bold mb-6 text-center">Nova Senha</h1>
        
        <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
          <input 
            type="password" 
            placeholder="Digite sua nova senha"
            className="w-full p-3 rounded-lg bg-black border border-white/10 text-white outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 font-bold p-3 rounded-lg transition-colors"
          >
            {loading ? 'Atualizando...' : 'Definir nova senha'}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-amber-400">{message}</p>
        )}
      </div>
    </div>
  )
}