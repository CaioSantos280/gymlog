'use client'

import { useEffect, useState } from 'react'
import { AvatarFrame } from './Avatarframe'
import { calcularProgressoRank } from '@/lib/ranks'
import { buscarMolduraPorXp, type AvatarDef } from '@/lib/Avatars'
import { salvarNomeUsuario } from '@/lib/gamification'

interface AvatarHeroProps {
  avatar: AvatarDef
  nomeUsuario: string | null
  xpAtual: number
  perfilId: string
  onNomeAtualizado?: (novoNome: string) => void
}

export function AvatarHero({ avatar, nomeUsuario, xpAtual, perfilId, onNomeAtualizado }: AvatarHeroProps) {
  const progresso = calcularProgressoRank(xpAtual)
  const moldura = buscarMolduraPorXp(xpAtual)
  const [largura, setLargura] = useState(0)

  const [editando, setEditando] = useState(false)
  const [nomeInput, setNomeInput] = useState(nomeUsuario ?? '')
  const [salvando, setSalvando] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setLargura(progresso.percentual), 150)
    return () => clearTimeout(t)
  }, [progresso.percentual])

  // mantém o input sincronizado se o nome mudar vindo de fora (ex: outro device)
  useEffect(() => {
    setNomeInput(nomeUsuario ?? '')
  }, [nomeUsuario])

  function abrirEdicao() {
    setNomeInput(nomeUsuario ?? '')
    setEditando(true)
  }

  function cancelarEdicao() {
    setNomeInput(nomeUsuario ?? '')
    setEditando(false)
  }

  async function handleSalvarNome() {
    const nomeLimpo = nomeInput.trim()
    if (!nomeLimpo || salvando) return

    setSalvando(true)
    const sucesso = await salvarNomeUsuario(perfilId, nomeLimpo)
    setSalvando(false)

    if (sucesso) {
      onNomeAtualizado?.(nomeLimpo)
      setEditando(false)
    }
  }

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-white/10 px-5 pt-7 pb-5 shadow-2xl flex flex-col items-center text-center"
      style={{
        background: `radial-gradient(120% 100% at 50% 0%, ${progresso.atual.corGlow} 0%, #121212 60%)`,
      }}
    >
      <AvatarFrame
        src={avatar.arquivo}
        alt={avatar.nome}
        moldura={moldura}
        tamanho={120}
      />

      {/* Nome do usuário — visualização ou edição inline */}
      {editando ? (
        <div className="mt-4 w-full flex flex-col items-center gap-2 px-2">
          <input
            type="text"
            autoFocus
            maxLength={24}
            value={nomeInput}
            onChange={(e) => setNomeInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSalvarNome()}
            placeholder="Seu nome de atleta"
            className="w-full max-w-[220px] bg-[#1a1a1a] border border-white/15 rounded-lg px-3 py-2 text-center text-base font-black outline-none focus:border-blue-500"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleSalvarNome}
              disabled={salvando || !nomeInput.trim()}
              className="text-xs font-bold text-blue-400 hover:text-blue-300 disabled:opacity-40 active:scale-95 transition-all"
            >
              {salvando ? 'Salvando...' : 'Salvar'}
            </button>
            <button
              onClick={cancelarEdicao}
              disabled={salvando}
              className="text-xs font-bold text-white/30 hover:text-white/60 active:scale-95 transition-all"
            >
              Cancelar
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={abrirEdicao}
          className="mt-4 flex items-center gap-1.5 max-w-full px-4 active:scale-95 transition-all group"
        >
          <p className="text-lg font-black truncate">
            {nomeUsuario || 'Atleta GYMLOG'}
          </p>
          <span className="text-sm text-white/30 group-hover:text-white/60 transition-colors shrink-0">
            ✏️
          </span>
        </button>
      )}

      <p className="text-[11px] text-white/40 font-medium -mt-0.5">{avatar.nome}</p>

      <h2
        className="text-2xl font-black italic tracking-tight mt-2"
        style={{ color: progresso.atual.cor, textShadow: `0 0 20px ${progresso.atual.corGlow}` }}
      >
        {progresso.atual.nome}
      </h2>

      {/* Barra de XP */}
      <div className="w-full mt-4">
        <div className="h-3 w-full rounded-full bg-white/5 overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full transition-all duration-1000 ease-out"
            style={{
              width: `${largura}%`,
              background: progresso.atual.gradiente,
              boxShadow: `0 0 16px ${progresso.atual.corGlow}`,
            }}
          />
        </div>
        <div className="flex items-center justify-between mt-2 text-left">
          <p className="text-[11px] font-mono text-white/50">
            {progresso.xpNoRankAtual.toLocaleString('pt-BR')}
            {progresso.proximo && ` / ${progresso.xpNecessarioNoRank.toLocaleString('pt-BR')} XP`}
          </p>
          {progresso.proximo ? (
            <p className="text-[11px] font-bold text-white/40">
              Próximo: <span className="text-white/70">{progresso.proximo.nome}</span>
            </p>
          ) : (
            <p className="text-[11px] font-bold text-white/40">Nível máximo</p>
          )}
        </div>
      </div>
    </div>
  )
}