// lib/gamification.ts
// Lógica central de XP / Rank / Streak / PR do GYMLOG com trava de registro único.

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

// Chave fixa para garantir que o app local/sem auth use rigorosamente a MESMA linha
const ID_PERFIL_UNICO = '00000000-0000-0000-0000-000000000000'

/** Busca o perfil único ou força a criação/atualização usando ID fixo para evitar duplicatas */
export async function buscarOuCriarPerfil(): Promise<Perfil | null> {
  // Tenta buscar a linha com o ID fixo travado
  const { data, error } = await supabase
    .from('perfil')
    .select('*')
    .eq('id', ID_PERFIL_UNICO)
    .maybeSingle()

  if (error) {
    console.error('Erro ao buscar perfil:', error.message)
    return null
  }

  if (data) return data as Perfil

  // Se não existir (ou se você limpou a tabela), cria cravando o ID único.
  // Usamos .upsert com onConflict para blindar de vez contra duas requisições simultâneas
  const { data: novo, error: erroUpsert } = await supabase
    .from('perfil')
    .upsert(
      { 
        id: ID_PERFIL_UNICO,
        xp_atual: 0, 
        rank_nome: RANKS[0].nome, 
        streak_dias: 0,
        avatar_id: 'default',
        nome_usuario: 'Atleta GYMLOG'
      },
      { onConflict: 'id' }
    )
    .select()
    .single()

  if (erroUpsert) {
    console.error('Erro ao garantir perfil único:', erroUpsert.message)
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

  if (!ultimaData) return 1
  if (ultimaData === hoje) return streakAtual
  if (ultimaData === diaAnteriorISO(hoje)) return streakAtual + 1
  return 1
}

/** Retorna XP bônus de streak, se algum marco foi batido exatamente agora. */
function bonusDeStreak(novoStreak: number): { xp: number; label: string } | null {
  if (novoStreak === 100) return { xp: XP_RULES.STREAK_100_DIAS, label: '🔥 100 dias de sequência' }
  if (novoStreak === 30) return { xp: XP_RULES.STREAK_30_DIAS, label: '🔥 30 dias de sequência' }
  if (novoStreak === 7) return { xp: XP_RULES.STREAK_7_DIAS, label: '🔥 7 dias de sequência' }
  return null
}

/** Verifica no histórico se o peso do treino bate o recorde anterior e atualiza a carga antiga */
async function verificarERegistrarPR(exercicio: string, peso: number): Promise<boolean> {
  const { data: recordeAtual } = await supabase
    .from('prs')
    .select('id, carga')
    .eq('exercicio', exercicio)
    .maybeSingle()

  // Se já existir um recorde para esse exercício
  if (recordeAtual) {
    if (peso <= recordeAtual.carga) return false // Não bateu o recorde antigo

    // Atualiza a MESMA linha do exercício com a nova carga maior
    const { error } = await supabase
      .from('prs')
      .update({ carga: peso, created_at: new Date().toISOString() })
      .eq('id', recordeAtual.id)

    if (error) console.error('Erro ao atualizar PR:', error.message)
    return !error
  }

  // Se for a primeira vez fazendo o exercício, insere uma nova linha para ele
  const { error } = await supabase
    .from('prs')
    .insert([{ exercicio, carga: peso }])
    
  if (error) {
    console.error('Erro ao salvar novo PR:', error.message)
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

/** Processa um treino recém-salvo atualizando rigorosamente a mesma linha do perfil */
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

  // Faz a atualização cravada no ID do perfil ativo
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
