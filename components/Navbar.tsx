'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Menu, X, BarChart2, Dumbbell, Trophy, Utensils, ClipboardList, User, LogOut, LogIn } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    // 1. Verifica se já existe um usuário logado ao carregar a barra
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      if (user) {
        console.log("🔥 Usuário logado encontrado ID:", user.id)
      }
    }
    checkUser()

    // 2. Escuta mudanças de estado (Login / Logout) em tempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setIsOpen(false)
    router.push('/login')
  }

  const menuItems = [
    { name: 'Treinos', href: '/', icon: <Dumbbell size={20} /> },
    { name: 'Gráficos', href: '/graphic', icon: <BarChart2 size={20} /> },
    { name: 'Rotina', href: '/treinos', icon: <ClipboardList size={20} /> },
    { name: 'Dieta', href: '/dieta', icon: <Utensils size={20} /> },
    { name: 'Perfil', href: '/perfil', icon: <User size={20} /> },
  ]

  return (
    <>
      {/* Barra Superior Fixa */}
      <nav className="fixed top-0 left-0 w-full z-[100] bg-[#0a0a0a] border-b border-white/5 h-16 flex items-center justify-between px-6">
        <Link href="/" className="text-xl font-black text-blue-500 italic tracking-tighter">
          GYMLOG
        </Link>

        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-gray-400 hover:text-white transition-colors z-[110]"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </nav>

      {/* Menu Overlay - Agora 100% Sólido e Animado */}
      {isOpen && (
        <div className="fixed inset-0 bg-[#0a0a0a] z-[90] flex flex-col pt-24 px-6 animate-slide-down">
          <div className="flex flex-col gap-4">
            {menuItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#111111] border border-white/10 hover:border-blue-500/50 transition-all text-lg font-bold"
              >
                <span className="text-blue-500 bg-blue-500/10 p-2 rounded-lg">
                  {item.icon}
                </span>
                {item.name}
              </Link>
            ))}

            {/* Botão Dinâmico de Login / Logout */}
            {user ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#111111] border border-red-500/20 hover:border-red-500/50 transition-all text-lg font-bold text-red-500 w-full text-left"
              >
                <span className="text-red-500 bg-red-500/10 p-2 rounded-lg">
                  <LogOut size={20} />
                </span>
                Sair da Conta
              </button>
            ) : (
              <Link
                href="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-4 p-5 rounded-2xl bg-[#111111] border border-green-500/20 hover:border-green-500/50 transition-all text-lg font-bold text-green-500"
              >
                <span className="text-green-500 bg-green-500/10 p-2 rounded-lg">
                  <LogIn size={20} />
                </span>
                Entrar / Criar Conta
              </Link>
            )}
          </div>

          <div className="mt-auto pb-12 text-center">
            {user && (
              <p className="text-xs text-gray-500 mb-2 truncate max-w-xs mx-auto">
                Logado como: {user.email}
              </p>
            )}
            <p className="text-gray-700 text-[10px] uppercase tracking-[0.4em] font-bold">
              GymLog System
            </p>
          </div>
        </div>
      )}
    </>
  )
}