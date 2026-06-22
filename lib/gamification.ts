// lib/gamification.ts
// Lógica central de XP / Rank / Streak / PR do GYMLOG (Migrado para Autenticação).

import { supabase } from './supabase'
import { calcularProgressoRank, RANKS } from './ranks'

export const XP_RULES = {
  TREINO_CONCLUIDO: 100,
  REGISTRAR_TREINO: 5,
  NOVO_PR: 50,
  STREAK_7_DIAS: 100,
  STREAK_30_DIAS: 500,
  STREAK_100_DIAS: 2000,
} as const

export interface Perfil {
  id: string
  user_id: string | null
  xp_atual: number
  rank_nome: string
  streak_dias: number
  ultimo_treino_data: string | null
  avatar_id: string
  nome_usuario: string | null
  updated_at: string
}

export interface NovoTreinoInput {
  exercicio: string
  peso: number
  carga_total: number
}

export interface ResultadoProcessamento {
  perfil: Perfil
  xpGanho: number
  detalheXp: string[]
  ehNovoRecorde: boolean
  rankSubiu: boolean
  rankAnterior: string
}

/** Busca o perfil do usuário. O Trigger no banco já cria o perfil automaticamente no Sign Up. */
export async function buscarOuCriarPerfil(userId: string): Promise<Perfil | null> {
  const ID_FIXO_ANTIGO = '93d8f826-2ff0-4a1a-84af-a073ffe4d6b6'

  // 1. Busca o perfil atrelado ao user_id real
  const { data: perfilLogado, error: erroLogado } = await supabase
    .from('perfil')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()

  if (erroLogado) {
    console.error('Erro ao buscar perfil logado:', erroLogado.message)
    return null
  }

  if (perfilLogado) return perfilLogado as Perfil

  // 2. Tenta migrar perfil antigo caso exista (logica de transicao)
  const { data: perfilAntigo } = await supabase
    .from('perfil')
    .select('*')
    .eq('id', ID_FIXO_ANTIGO)
    .maybeSingle()

  if (perfilAntigo && !perfilAntigo.user_id) {
    const { data: migrado, error: erroMigrar } = await supabase
      .from('perfil')
      .update({ user_id: userId, updated_at: new Date().toISOString() })
      .eq('id', ID_FIXO_ANTIGO)
      .select()
      .single()

    if (!erroMigrar && migrado) return migrado as Perfil
  }

  // 3. Se não achou, retornamos null. O Trigger deve garantir que o perfil já exista.
  console.warn('Perfil não encontrado para o usuário:', userId)
  return null
}

function hojeISO(): string {
  return new Date().toISOString().split('T')[0]
}

function diaAnteriorISO(dataISO: string): string {
  const d = new Date(dataISO + 'T00:00:00')
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

function calcularNovoStreak(streakAtual: number, ultimaData: string | null): number {
  const hoje = hojeISO()
  if (!ultimaData) return 1
  if (ultimaData === hoje) return streakAtual
  if (ultimaData === diaAnteriorISO(hoje)) return streakAtual + 1
  return 1
}

function bonusDeStreak(novoStreak: number): { xp: number; label: string } | null {
  if (novoStreak === 100) return { xp: XP_RULES.STREAK_100_DIAS, label: '🔥 100 dias de sequência' }
  if (novoStreak === 30) return { xp: XP_RULES.STREAK_30_DIAS, label: '🔥 30 dias de sequência' }
  if (novoStreak === 7) return { xp: XP_RULES.STREAK_7_DIAS, label: '🔥 7 dias de sequência' }
  return null
}

async function verificarERegistrarPR(exercicio: string, peso: number, userId: string): Promise<boolean> {
  const { data: recordeAtual } = await supabase
    .from('prs')
    .select('id, carga')
    .eq('exercicio', exercicio)
    .or(`user_id.eq.${userId},user_id.is.null`)
    .order('carga', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (recordeAtual) {
    if (peso <= recordeAtual.carga) return false
    const { error } = await supabase
      .from('prs')
      .update({ carga: peso, created_at: new Date().toISOString() })
      .eq('id', recordeAtual.id)
    return !error
  }

  const { error } = await supabase.from('prs').insert([{ exercicio, carga: peso, user_id: userId }])
  return !error
}

export async function salvarAvatarSelecionado(perfilId: string, avatarId: string): Promise<boolean> {
  const { error } = await supabase
    .from('perfil')
    .update({ avatar_id: avatarId, updated_at: new Date().toISOString() })
    .eq('id', perfilId)
  return !error
}

export async function salvarNomeUsuario(perfilId: string, nome: string): Promise<boolean> {
  const { error } = await supabase
    .from('perfil')
    .update({ nome_usuario: nome, updated_at: new Date().toISOString() })
    .eq('id', perfilId)
  return !error
}

export async function processarNovoTreino(input: NovoTreinoInput): Promise<ResultadoProcessamento | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const perfil = await buscarOuCriarPerfil(user.id)
  if (!perfil) return null

  const detalheXp: string[] = []
  let xpGanho = XP_RULES.REGISTRAR_TREINO + XP_RULES.TREINO_CONCLUIDO
  detalheXp.push(`+${XP_RULES.REGISTRAR_TREINO} XP — treino registrado`)
  detalheXp.push(`+${XP_RULES.TREINO_CONCLUIDO} XP — treino concluído`)

  const ehNovoRecorde = await verificarERegistrarPR(input.exercicio, input.peso, user.id)
  if (ehNovoRecorde) {
    xpGanho += XP_RULES.NOVO_PR
    detalheXp.push(`+${XP_RULES.NOVO_PR} XP — novo PR 🏆`)
  }

  const novoStreak = calcularNovoStreak(perfil.streak_dias, perfil.ultimo_treino_data)
  const bonus = bonusDeStreak(novoStreak)
  if (bonus) {
    xpGanho += bonus.xp
    detalheXp.push(`+${bonus.xp} XP — ${bonus.label}`)
  }

  const xpNovo = perfil.xp_atual + xpGanho
  const rankAnterior = perfil.rank_nome
  const novoProgresso = calcularProgressoRank(xpNovo)

  const { data: perfilAtualizado, error } = await supabase
    .from('perfil')
    .update({
      xp_atual: xpNovo,
      rank_nome: novoProgresso.atual.nome,
      streak_dias: novoStreak,
      ultimo_treino_data: hojeISO(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', perfil.id)
    .select()
    .single()

  if (error) return null

  return {
    perfil: perfilAtualizado as Perfil,
    xpGanho,
    detalheXp,
    ehNovoRecorde,
    rankSubiu: novoProgresso.atual.nome !== rankAnterior,
    rankAnterior,
  }
}