'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const router = useRouter()

  // 1. Função para Entrar (Login)
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setMessage(`Erro no login: ${error.message}`)
    } else {
      setMessage('Login realizado com sucesso! Redirecionando...')
      router.push('/')
    }
    setLoading(false)
  }

  // 2. Função para Cadastrar (Sign Up) - Isolada sem receber o evento 'e'
  const handleSignUp = async () => {
    if (!email || !password) {
      setMessage('Preencha o e-mail e a senha primeiro!')
      return
    }

    setLoading(true)
    setMessage('')

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(`Erro no cadastro: ${error.message}`)
    } else if (data.user) {
      setMessage('Cadastro realizado com sucesso! Você já pode entrar.')
    }
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="w-full max-w-md bg-[#111111] p-8 rounded-2xl border border-white/10">
        <h1 className="text-2xl font-black text-blue-500 italic mb-6 text-center tracking-tighter">
          GYMLOG AUTH
        </h1>
        
        <form onSubmit={handleSignIn} className="flex flex-col gap-4">
          <div>
            <label className="text-sm font-bold text-gray-400 block mb-1">E-mail</label>
            <input 
              type="email" 
              className="w-full p-3 rounded-lg bg-black border border-white/10 text-white focus:border-blue-500 outline-none transition-all"
              placeholder="seuemail@exemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-bold text-gray-400 block mb-1">Senha</label>
            <input 
              type="password" 
              className="w-full p-3 rounded-lg bg-black border border-white/10 text-white focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-blue-500 hover:bg-blue-600 font-bold p-3 rounded-lg transition-colors mt-2 disabled:opacity-50"
          >
            {loading ? 'Carregando...' : 'Entrar'}
          </button>

          <div className="flex items-center justify-between mt-2 text-sm text-gray-400">
            <span>Não tem conta?</span>
            <button 
              type="button"
              onClick={() => handleSignUp()}
              disabled={loading}
              className="text-blue-500 hover:underline font-bold disabled:opacity-50"
            >
              Criar Conta
            </button>
          </div>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm font-medium text-amber-400 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
            {message}
          </p>
        )}
      </div>
    </div>
  )
}