// lib/avatars.ts
// Fonte única de verdade para o sistema de Avatares RPG do GYMLOG.
// Cada avatar é desbloqueado a partir de um rank mínimo (xpMin equivalente).
// Ranks que não têm avatar novo mantêm o último avatar desbloqueado.

import { RANKS, calcularProgressoRank } from './ranks'

export interface AvatarDef {
  id: string           // slug usado no arquivo PNG e no banco (avatar_id)
  nome: string
  arquivo: string       // caminho em /public/avatars/
  rankRequerido: string // nome exato do rank em RANKS
}

export const AVATARS: AvatarDef[] = [
  { id: 'beginner-human',   nome: 'Beginner Human',   arquivo: '/avatars/beginner-human.png',   rankRequerido: 'Bronze I' },
  { id: 'trained-human',    nome: 'Trained Human',    arquivo: '/avatars/trained-human.png',    rankRequerido: 'Bronze II' },
  { id: 'fighter',          nome: 'Fighter',           arquivo: '/avatars/fighter.png',           rankRequerido: 'Bronze III' },
  { id: 'warrior',          nome: 'Warrior',           arquivo: '/avatars/warrior.png',           rankRequerido: 'Prata I' },
  { id: 'spartan',          nome: 'Spartan',           arquivo: '/avatars/spartan.png',           rankRequerido: 'Prata II' },
  { id: 'viking',           nome: 'Viking',            arquivo: '/avatars/viking.png',            rankRequerido: 'Prata III' },
  { id: 'samurai',          nome: 'Samurai',           arquivo: '/avatars/samurai.png',           rankRequerido: 'Ouro I' },
  { id: 'dark-knight',      nome: 'Dark Knight',       arquivo: '/avatars/dark-knight.png',       rankRequerido: 'Ouro II' },
  { id: 'minotaur',         nome: 'Minotaur',          arquivo: '/avatars/minotaur.png',          rankRequerido: 'Ouro III' },
  { id: 'werewolf',         nome: 'Werewolf',          arquivo: '/avatars/werewolf.png',          rankRequerido: 'Platina I' },
  { id: 'muscular-pitbull', nome: 'Muscular Pitbull',  arquivo: '/avatars/muscular-pitbull.png',  rankRequerido: 'Platina II' },
  { id: 'alpha-gorilla',    nome: 'Alpha Gorilla',     arquivo: '/avatars/alpha-gorilla.png',     rankRequerido: 'Platina III' },
  { id: 'lion-king',        nome: 'Lion King',         arquivo: '/avatars/lion-king.png',         rankRequerido: 'Diamante I' },
  { id: 'legendary-tiger',  nome: 'Legendary Tiger',   arquivo: '/avatars/legendary-tiger.png',   rankRequerido: 'Diamante II' },
  { id: 'young-dragon',     nome: 'Young Dragon',      arquivo: '/avatars/young-dragon.png',      rankRequerido: 'Diamante III' },
  { id: 'ancient-dragon',   nome: 'Ancient Dragon',    arquivo: '/avatars/ancient-dragon.png',    rankRequerido: 'Mestre I' },
  { id: 'strength-demon',   nome: 'Strength Demon',    arquivo: '/avatars/strength-demon.png',    rankRequerido: 'Mestre II' },
  { id: 'titan',            nome: 'Titan',              arquivo: '/avatars/titan.png',              rankRequerido: 'Mestre III' },
  { id: 'god-of-war',       nome: 'God of War',        arquivo: '/avatars/god-of-war.png',        rankRequerido: 'Lendário I' },
  { id: 'cosmic-entity',    nome: 'Cosmic Entity',     arquivo: '/avatars/cosmic-entity.png',     rankRequerido: '🌌 Mítico' },
]

/** XP mínimo exigido por cada avatar, derivado do rank requerido. */
function xpMinDoAvatar(avatar: AvatarDef): number {
  const rank = RANKS.find((r) => r.nome === avatar.rankRequerido)
  return rank?.xpMin ?? 0
}

/** Retorna true se o XP atual do usuário já desbloqueou esse avatar. */
export function avatarDesbloqueado(avatar: AvatarDef, xpAtual: number): boolean {
  return xpAtual >= xpMinDoAvatar(avatar)
}

/** Retorna o avatar mais "avançado" que o XP atual já desbloqueou. */
export function avatarMaximoDesbloqueado(xpAtual: number): AvatarDef {
  let melhor = AVATARS[0]
  for (const avatar of AVATARS) {
    if (xpAtual >= xpMinDoAvatar(avatar)) melhor = avatar
  }
  return melhor
}

export function buscarAvatarPorId(id: string | null | undefined): AvatarDef {
  return AVATARS.find((a) => a.id === id) ?? AVATARS[0]
}

// ─────────────────────────────────────────────────────────────────────────
// Molduras por categoria de rank
// ─────────────────────────────────────────────────────────────────────────

export interface MolduraDef {
  borda: string        // cor/gradiente da borda do avatar
  glow: string          // sombra/brilho ao redor
  anel?: string          // gradiente extra para efeito de anel giratório (ranks altos)
  animada?: boolean      // se true, aplica efeito de brilho pulsante
}

const MOLDURAS: Record<string, MolduraDef> = {
  Bronze:      { borda: 'linear-gradient(135deg, #8a5226, #C5793B)', glow: 'rgba(197,121,59,0.55)' },
  Prata:       { borda: 'linear-gradient(135deg, #7d8694, #E2E8F0)', glow: 'rgba(184,192,204,0.55)' },
  Ouro:        { borda: 'linear-gradient(135deg, #a87a16, #FFD700)', glow: 'rgba(232,179,61,0.6)' },
  Platina:     { borda: 'linear-gradient(135deg, #1f8a7a, #4DD6C0)', glow: 'rgba(77,214,192,0.6)', anel: 'conic-gradient(from 0deg, #4DD6C0, transparent, #4DD6C0)' },
  Diamante:    { borda: 'linear-gradient(135deg, #1b6fa3, #5AC8FA)', glow: 'rgba(90,200,250,0.65)', anel: 'conic-gradient(from 0deg, #5AC8FA, transparent, #5AC8FA)' },
  Rubi:        { borda: 'linear-gradient(135deg, #99102a, #FF4D6A)', glow: 'rgba(255,77,106,0.65)' },
  Esmeralda:   { borda: 'linear-gradient(135deg, #156b3c, #34D27A)', glow: 'rgba(52,210,122,0.65)' },
  Safira:      { borda: 'linear-gradient(135deg, #15287a, #3D6BFF)', glow: 'rgba(61,107,255,0.65)' },
  Mestre:      { borda: 'linear-gradient(135deg, #FFFFFF, #E5E5E5)', glow: 'rgba(255,255,255,0.7)', animada: true },
  'Grão-Mestre': { borda: 'linear-gradient(135deg, #0a0a0a, #FF3DBE)', glow: 'rgba(255,61,190,0.7)', anel: 'conic-gradient(from 0deg, #FF3DBE, #0a0a0a, #FF3DBE)', animada: true },
  Lendário:    { borda: 'linear-gradient(135deg, #8a6e10, #FFD23D)', glow: 'rgba(255,210,61,0.75)', anel: 'conic-gradient(from 0deg, #FFD23D, #fff, #FFD23D)', animada: true },
  Mítico:      { borda: 'linear-gradient(135deg, #B14DFF, #5AC8FA, #FFD23D)', glow: 'rgba(255,255,255,0.85)', anel: 'conic-gradient(from 0deg, #B14DFF, #5AC8FA, #FFD23D, #B14DFF)', animada: true },
}

/** Extrai a categoria de rank (ex: "Ouro II" → "Ouro") para buscar a moldura certa. */
function categoriaDoRank(nomeRank: string): string {
  if (nomeRank.includes('Mítico')) return 'Mítico'
  if (nomeRank.startsWith('Grão-Mestre')) return 'Grão-Mestre'
  return nomeRank.replace(/\s+(I|II|III)$/, '').trim()
}

export function buscarMolduraPorRank(nomeRank: string): MolduraDef {
  const categoria = categoriaDoRank(nomeRank)
  return MOLDURAS[categoria] ?? MOLDURAS.Bronze
}

export function buscarMolduraPorXp(xpAtual: number): MolduraDef {
  const { atual } = calcularProgressoRank(xpAtual)
  return buscarMolduraPorRank(atual.nome)
}