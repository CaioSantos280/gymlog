// lib/gamification.ts
// Lógica central de XP / Rank / Streak / PR do GYMLOG.
// Toda vez que um treino é salvo, chame `processarNovoTreino` para
// atualizar perfil, registrar PR (se houver) e devolver os dados
// atualizados para a UI.

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

/** Busca o perfil único do usuário (linha única, sem auth). Cria se não existir. */
export async function buscarOuCriarPerfil(): Promise<Perfil | null> {
  const { data, error } = await supabase
    .from('perfil')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) {
    console.error('Erro ao buscar perfil:', error.message)
    return null
  }

  if (data) return data as Perfil

  const { data: novo, error: erroInsert } = await supabase
    .from('perfil')
    .insert([{ xp_atual: 0, rank_nome: RANKS[0].nome, streak_dias: 0 }])
    .select()
    .single()

  if (erroInsert) {
    console.error('Erro ao criar perfil:', erroInsert.message)
    return null
  }

  return novo as Perfil
}

function hojeISO(): string {
  return new Date().toISOString().split('T')[0]
}

function diaAnteriorISO(dataISO: string): string {
  const d = new Date(dataISO + 'T00:00:00')
  d.setDate(d.getDate() - 1)
  return d.toISOString().split('T')[0]
}

/** Calcula o novo streak com base na última data de treino registrada. */
function calcularNovoStreak(streakAtual: number, ultimaData: string | null): number {
  const hoje = hojeISO()

  if (!ultimaData) return 1 // primeiro treino de todos
  if (ultimaData === hoje) return streakAtual // já treinou hoje, não duplica
  if (ultimaData === diaAnteriorISO(hoje)) return streakAtual + 1 // treinou ontem, mantém sequência
  return 1 // quebrou a sequência, reinicia
}

/** Retorna XP bônus de streak, se algum marco foi batido exatamente agora. */
function bonusDeStreak(novoStreak: number): { xp: number; label: string } | null {
  if (novoStreak === 100) return { xp: XP_RULES.STREAK_100_DIAS, label: '🔥 100 dias de sequência' }
  if (novoStreak === 30) return { xp: XP_RULES.STREAK_30_DIAS, label: '🔥 30 dias de sequência' }
  if (novoStreak === 7) return { xp: XP_RULES.STREAK_7_DIAS, label: '🔥 7 dias de sequência' }
  return null
}

/** Verifica no histórico se o peso do treino bate o recorde anterior do exercício. */
async function verificarERegistrarPR(exercicio: string, peso: number): Promise<boolean> {
  const { data: recordeAtual } = await supabase
    .from('prs')
    .select('carga')
    .eq('exercicio', exercicio)
    .order('carga', { ascending: false })
    .limit(1)
    .maybeSingle()

  const recordeAnterior = recordeAtual?.carga ?? 0

  if (peso <= recordeAnterior) return false

  const { error } = await supabase.from('prs').insert([{ exercicio, carga: peso }])
  if (error) {
    console.error('Erro ao salvar PR:', error.message)
    return false
  }
  return true
}

/** Atualiza o avatar equipado pelo usuário e persiste no Supabase. */
export async function salvarAvatarSelecionado(perfilId: string, avatarId: string): Promise<boolean> {
  const { error } = await supabase
    .from('perfil')
    .update({ avatar_id: avatarId, updated_at: new Date().toISOString() })
    .eq('id', perfilId)

  if (error) {
    console.error('Erro ao salvar avatar:', error.message)
    return false
  }
  return true
}

/** Atualiza o nome de usuário exibido no perfil. */
export async function salvarNomeUsuario(perfilId: string, nome: string): Promise<boolean> {
  const { error } = await supabase
    .from('perfil')
    .update({ nome_usuario: nome, updated_at: new Date().toISOString() })
    .eq('id', perfilId)

  if (error) {
    console.error('Erro ao salvar nome:', error.message)
    return false
  }
  return true
}

/**
 * Processa um treino recém-salvo: aplica XP de registro + conclusão,
 * verifica PR, atualiza streak e persiste o perfil atualizado.
 */
export async function processarNovoTreino(input: NovoTreinoInput): Promise<ResultadoProcessamento | null> {
  const perfil = await buscarOuCriarPerfil()
  if (!perfil) return null

  const detalheXp: string[] = []
  let xpGanho = XP_RULES.REGISTRAR_TREINO + XP_RULES.TREINO_CONCLUIDO
  detalheXp.push(`+${XP_RULES.REGISTRAR_TREINO} XP — treino registrado`)
  detalheXp.push(`+${XP_RULES.TREINO_CONCLUIDO} XP — treino concluído`)

  const ehNovoRecorde = await verificarERegistrarPR(input.exercicio, input.peso)
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
  const rankSubiu = novoProgresso.atual.nome !== rankAnterior

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

  if (error) {
    console.error('Erro ao atualizar perfil:', error.message)
    return null
  }

  return {
    perfil: perfilAtualizado as Perfil,
    xpGanho,
    detalheXp,
    ehNovoRecorde,
    rankSubiu,
    rankAnterior,
  }
}