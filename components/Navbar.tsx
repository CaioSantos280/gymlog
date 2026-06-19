'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu, X, BarChart2, Dumbbell, Trophy, Utensils, ClipboardList, User } from 'lucide-react'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = [
    { name: 'Treinos', href: '/', icon: <Dumbbell size={20} /> },
    { name: 'Gráficos', href: '/graphic', icon: <BarChart2 size={20} /> },
    { name: 'Rotina', href: '/treinos', icon: <ClipboardList size={20} /> },
    { name: 'Dieta', href: '/dieta', icon: <Utensils size={20} /> },
    { name: 'Recordes (PRs)', href: '/recordes', icon: <Trophy size={20} /> },
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
            {menuItems.map((item, index) => (
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
          </div>

          <div className="mt-auto pb-12 text-center">
            <p className="text-gray-700 text-[10px] uppercase tracking-[0.4em] font-bold">
              GymLog System
            </p>
          </div>
        </div>
      )}
    </>
  )
}