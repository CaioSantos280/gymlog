'use client'

import { useState, type FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthPage() {
  const [view, setView] = useState<'login' | 'cadastro'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const router = useRouter()

  const handleAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    try {
      if (view === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setMessage(`Erro: ${error.message}`)
        } else {
          router.push('/')
          router.refresh()
        }
        return
      }

      // CADASTRO
      if (!nome.trim()) {
        setMessage('O nome é obrigatório!')
        return
      }

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome, // O trigger no banco lerá isso de raw_user_meta_data
          },
        },
      })

      if (error) {
        setMessage(`Erro: ${error.message}`)
      } else {
        setMessage('Cadastro feito! Verifique seu e-mail para confirmar a conta.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setMessage('Digite seu e-mail primeiro.')
      return
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-senha`,
    })

    setMessage(error ? `Erro: ${error.message}` : 'E-mail enviado!')
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#0a0a0a] text-white p-4">
      <div className="w-full max-w-md bg-[#111111] p-8 rounded-2xl border border-white/10">
        <h1 className="text-2xl font-black text-blue-500 mb-6 text-center">
          GYMLOG {view === 'login' ? 'LOGIN' : 'CADASTRO'}
        </h1>

        <form onSubmit={handleAuth} className="flex flex-col gap-4">
          {view === 'cadastro' && (
            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome"
              className="p-3 rounded bg-black border border-white/10"
              required
            />
          )}

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="p-3 rounded bg-black border border-white/10"
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Senha"
            className="p-3 rounded bg-black border border-white/10"
            required
          />

          {view === 'login' && (
            <button
              type="button"
              onClick={handleResetPassword}
              className="text-xs text-gray-500 text-right hover:text-white"
            >
              Esqueceu a senha?
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 p-3 rounded font-bold disabled:opacity-50 hover:bg-blue-600 transition-colors"
          >
            {loading ? 'Carregando...' : view === 'login' ? 'Entrar' : 'Criar conta'}
          </button>
        </form>

        <button
          onClick={() => setView(view === 'login' ? 'cadastro' : 'login')}
          className="mt-6 text-blue-500 text-sm hover:underline w-full text-center"
        >
          {view === 'login' ? 'Criar conta' : 'Já tenho conta'}
        </button>

        {message && (
          <p className="mt-4 text-sm text-amber-400 text-center">{message}</p>
        )}
      </div>
    </div>
  )
}