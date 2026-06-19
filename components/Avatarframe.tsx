'use client'

import Image from 'next/image'
import { type MolduraDef } from '@/lib/Avatars'

interface AvatarFrameProps {
  src: string
  alt: string
  moldura: MolduraDef
  tamanho?: number
  bloqueado?: boolean
}

export function AvatarFrame({ src, alt, moldura, tamanho = 112, bloqueado = false }: AvatarFrameProps) {
  const espessuraBorda = Math.max(3, Math.round(tamanho * 0.035))

  return (
    <div
      className="relative shrink-0"
      style={{ width: tamanho, height: tamanho }}
    >
      {/* Anel giratório (ranks altos) */}
      {moldura.anel && !bloqueado && (
        <div
          className="absolute inset-[-6px] rounded-full"
          style={{
            background: moldura.anel,
            filter: 'blur(1px)',
            animation: moldura.animada ? 'gymlog-spin 6s linear infinite' : undefined,
          }}
        />
      )}

      {/* Glow externo */}
      {!bloqueado && (
        <div
          className="absolute inset-0 rounded-full"
          style={{ boxShadow: `0 0 ${tamanho * 0.25}px ${moldura.glow}` }}
        />
      )}

      {/* Moldura + imagem */}
      <div
        className="absolute inset-0 rounded-full p-[3px]"
        style={{
          background: bloqueado ? 'rgba(255,255,255,0.08)' : moldura.borda,
          padding: espessuraBorda,
        }}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden bg-[#1a1a1a]">
          <Image
            src={src}
            alt={alt}
            fill
            sizes={`${tamanho}px`}
            style={{ objectPosition: 'center 15%' }}
            className={`object-cover ${bloqueado ? 'grayscale opacity-30' : ''}`}
          />
        </div>
      </div>

      {/* Cadeado */}
      {bloqueado && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span style={{ fontSize: tamanho * 0.32 }}>🔒</span>
        </div>
      )}
    </div>
  )
}