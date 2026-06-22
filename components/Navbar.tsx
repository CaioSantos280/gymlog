'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Dumbbell, BarChart2, Utensils, ClipboardList, User, Settings, LogOut, LogIn, MoreHorizontal, X } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { User as SupabaseUser } from '@supabase/supabase-js'

export function Navbar() {
  const [isSheetOpen, setIsSheetOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const [hideBar, setHideBar] = useState(false)
  const lastScrollY = useRef(0)
  const router = useRouter()
  const pathname = usePathname()
  const hideNavbar = pathname === '/login'
  

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    checkUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    document.body.style.overflow = isSheetOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isSheetOpen])

  // Esconde a barra ao rolar pra baixo, mostra ao rolar pra cima
  useEffect(() => {
    let ticking = false

    function onScroll() {
      if (ticking) return
      ticking = true

      requestAnimationFrame(() => {
        const currentY = window.scrollY
        const diff = currentY - lastScrollY.current

        // Ignora micro-scrolls e o topo da página
        if (currentY < 40) {
          setHideBar(false)
        } else if (diff > 5) {
          setHideBar(true)
        } else if (diff < -5) {
          setHideBar(false)
        }

        lastScrollY.current = currentY
        ticking = false
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function closeSheet() {
    if (!isSheetOpen) return
    setIsClosing(true)
    setTimeout(() => {
      setIsSheetOpen(false)
      setIsClosing(false)
    }, 200)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    closeSheet()
    router.push('/login')
  }

  const sideItemsLeft = [
    { name: 'Rotina', href: '/treinos', icon: <ClipboardList size={21} /> },
    { name: 'Dieta', href: '/dieta', icon: <Utensils size={21} /> },
  ]

  const sideItemsRight = [
    { name: 'Gráficos', href: '/graphic', icon: <BarChart2 size={21} /> },
  ]

  const sheetItems = [
    { name: 'Perfil', href: '/perfil', icon: <User size={20} /> },
    { name: 'Configurações', href: '/settings', icon: <Settings size={20} /> },
  ]

  const initial = user?.email?.charAt(0).toUpperCase()
  const isMoreActive = sheetItems.some((item) => item.href === pathname)
  const isHomeActive = pathname === '/'
  if (hideNavbar) return null

  return (
    <>
      {/* Barra Superior */}
      <header className="fixed top-0 left-0 w-full z-[100] bg-[#0a0a0a]/90 backdrop-blur-md border-b border-white/5 h-14 flex items-center justify-between px-5">
        <Link href="/" className="text-lg font-black text-blue-500 italic tracking-tighter">
          GYMLOG
        </Link>
        {user && (
          <div className="w-7 h-7 rounded-full bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-[11px] font-bold text-blue-400">
            {initial}
          </div>
        )}
      </header>

      {/* Barra Inferior Flutuante - some ao rolar pra baixo */}
      <nav
        className={`fixed bottom-4 left-4 right-4 z-[100] rounded-[28px] bg-[#0a0a0a]/95 backdrop-blur-md border border-white/10 shadow-lg shadow-black/50 flex items-center px-2 transition-all duration-300 ${
          hideBar ? 'translate-y-24 opacity-0' : 'translate-y-0 opacity-100'
        }`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {sideItemsLeft.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 active:scale-95 transition-all"
            >
              <span className={isActive ? 'text-blue-400' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-bold ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}

        {/* Botão central elevado - Treinos (Home) */}
        <Link
          href="/"
          className="flex-1 flex flex-col items-center justify-center"
        >
          <span
            className={`-translate-y-5 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-90 ${
              isHomeActive
                ? 'bg-blue-500 shadow-blue-500/40'
                : 'bg-blue-500/90 shadow-blue-500/20'
            }`}
          >
            <Dumbbell size={24} className="text-white" />
          </span>
          <span className="text-[10px] font-bold text-blue-400 -mt-3">
            Treinos
          </span>
        </Link>

        {sideItemsRight.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-3 active:scale-95 transition-all"
            >
              <span className={isActive ? 'text-blue-400' : 'text-gray-500'}>
                {item.icon}
              </span>
              <span className={`text-[10px] font-bold ${isActive ? 'text-blue-400' : 'text-gray-500'}`}>
                {item.name}
              </span>
            </Link>
          )
        })}

        <button
          onClick={() => setIsSheetOpen(true)}
          className="flex-1 flex flex-col items-center justify-center gap-1 py-3 active:scale-95 transition-all"
        >
          <span className={isMoreActive ? 'text-blue-400' : 'text-gray-500'}>
            <MoreHorizontal size={21} />
          </span>
          <span className={`text-[10px] font-bold ${isMoreActive ? 'text-blue-400' : 'text-gray-500'}`}>
            Mais
          </span>
        </button>
      </nav>

      {/* Bottom Sheet */}
      {isSheetOpen && (
        <div className="fixed inset-0 z-[110] flex items-end">
          <div
            onClick={closeSheet}
            className={`absolute inset-0 bg-black/70 transition-opacity duration-200 ${
              isClosing ? 'opacity-0' : 'opacity-100'
            }`}
          />

          <div
            className={`relative w-full bg-[#0a0a0a] border-t border-white/10 rounded-t-3xl px-5 pt-3 transition-transform duration-200 ${
              isClosing ? 'translate-y-full' : 'translate-y-0'
            }`}
            style={{ paddingBottom: `calc(env(safe-area-inset-bottom) + 1.5rem)` }}
          >
            <div className="flex justify-center mb-3">
              <div className="w-10 h-1 rounded-full bg-white/15" />
            </div>

            <div className="flex items-center justify-between mb-4">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/25 font-bold">
                Mais opções
              </p>
              <button onClick={closeSheet} className="text-gray-500 hover:text-white p-1">
                <X size={20} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {sheetItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={closeSheet}
                    className={`flex items-center gap-4 p-4 rounded-2xl border transition-all text-base font-bold active:scale-[0.98] ${
                      isActive
                        ? 'bg-blue-500/10 border-blue-500/50 text-blue-400'
                        : 'bg-[#111111] border-white/10 hover:border-blue-500/50'
                    }`}
                  >
                    <span className={`p-2 rounded-lg ${isActive ? 'text-blue-400 bg-blue-500/20' : 'text-blue-500 bg-blue-500/10'}`}>
                      {item.icon}
                    </span>
                    {item.name}
                  </Link>
                )
              })}

              {user ? (
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#111111] border border-red-500/20 hover:border-red-500/50 transition-all text-base font-bold text-red-500 w-full text-left active:scale-[0.98]"
                >
                  <span className="text-red-500 bg-red-500/10 p-2 rounded-lg">
                    <LogOut size={20} />
                  </span>
                  Sair da Conta
                </button>
              ) : (
                <Link
                  href="/login"
                  onClick={closeSheet}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-[#111111] border border-green-500/20 hover:border-green-500/50 transition-all text-base font-bold text-green-500 active:scale-[0.98]"
                >
                  <span className="text-green-500 bg-green-500/10 p-2 rounded-lg">
                    <LogIn size={20} />
                  </span>
                  Entrar / Criar Conta
                </Link>
              )}
            </div>

            {user && (
              <p className="text-xs text-gray-500 text-center mt-4 truncate">
                Logado como: {user.email}
              </p>
            )}
          </div>
        </div>
      )}
    </>
  )
}