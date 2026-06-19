'use client'

import { AvatarFrame } from './Avatarframe'
import {
  AVATARS,
  avatarDesbloqueado,
  buscarMolduraPorRank,
  type AvatarDef,
} from '@/lib/Avatars'
import { RANKS } from '@/lib/ranks'

interface AvatarGridProps {
  xpAtual: number
  avatarSelecionadoId: string
  onSelecionar: (avatar: AvatarDef) => void
  salvando: boolean
}

function rankCorDoAvatar(rankRequerido: string): string {
  const rank = RANKS.find((r) => r.nome === rankRequerido)
  return rank?.cor ?? '#666'
}

export function AvatarGrid({ xpAtual, avatarSelecionadoId, onSelecionar, salvando }: AvatarGridProps) {
  return (
    <div className="bg-[#121212] rounded-xl border border-white/5 p-4">
      <p className="text-[10px] uppercase tracking-wider text-white/40 font-bold mb-3">
        Avatares ({AVATARS.filter((a) => avatarDesbloqueado(a, xpAtual)).length}/{AVATARS.length})
      </p>

      <div className="grid grid-cols-3 gap-3">
        {AVATARS.map((avatar) => {
          const desbloqueado = avatarDesbloqueado(avatar, xpAtual)
          const selecionado = avatar.id === avatarSelecionadoId
          const moldura = desbloqueado
            ? buscarMolduraPorRank(avatar.rankRequerido)
            : { borda: 'rgba(255,255,255,0.08)', glow: 'transparent' }

          return (
            <button
              key={avatar.id}
              disabled={!desbloqueado || salvando}
              onClick={() => desbloqueado && onSelecionar(avatar)}
              className={`flex flex-col items-center gap-1.5 p-2 rounded-xl transition-all active:scale-95 ${
                desbloqueado ? 'cursor-pointer' : 'cursor-not-allowed'
              } ${selecionado ? 'bg-white/10 ring-1 ring-white/20' : 'hover:bg-white/5'}`}
            >
              <AvatarFrame
                src={avatar.arquivo}
                alt={avatar.nome}
                moldura={moldura}
                tamanho={64}
                bloqueado={!desbloqueado}
              />
              <p
                className={`text-[10px] font-bold text-center leading-tight ${
                  desbloqueado ? 'text-white/80' : 'text-white/30'
                }`}
              >
                {avatar.nome}
              </p>
              {!desbloqueado && (
                <p
                  className="text-[8px] font-bold text-center leading-tight"
                  style={{ color: rankCorDoAvatar(avatar.rankRequerido) }}
                >
                  Requer {avatar.rankRequerido}
                </p>
              )}
              {selecionado && (
                <span className="text-[8px] font-black text-blue-400 uppercase">Equipado</span>
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}