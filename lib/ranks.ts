// lib/ranks.ts
// Fonte única de verdade para a progressão de Rank/XP do GYMLOG.

export interface RankDef {
  nome: string
  xpMin: number
  cor: string       // cor sólida principal (texto, ícones)
  corGlow: string    // cor usada em sombras/brilho (rgba)
  gradiente: string  // gradiente para a barra de XP
}

export const RANKS: RankDef[] = [
  { nome: 'Bronze I',       xpMin: 0,       cor: '#C5793B', corGlow: 'rgba(197,121,59,0.45)',  gradiente: 'linear-gradient(90deg, #8a5226, #C5793B)' },
  { nome: 'Bronze II',      xpMin: 500,     cor: '#C5793B', corGlow: 'rgba(197,121,59,0.45)',  gradiente: 'linear-gradient(90deg, #8a5226, #C5793B)' },
  { nome: 'Bronze III',     xpMin: 1000,    cor: '#C5793B', corGlow: 'rgba(197,121,59,0.45)',  gradiente: 'linear-gradient(90deg, #8a5226, #C5793B)' },
  { nome: 'Prata I',        xpMin: 1750,    cor: '#B8C0CC', corGlow: 'rgba(184,192,204,0.45)', gradiente: 'linear-gradient(90deg, #7d8694, #B8C0CC)' },
  { nome: 'Prata II',       xpMin: 2500,    cor: '#B8C0CC', corGlow: 'rgba(184,192,204,0.45)', gradiente: 'linear-gradient(90deg, #7d8694, #B8C0CC)' },
  { nome: 'Prata III',      xpMin: 3500,    cor: '#B8C0CC', corGlow: 'rgba(184,192,204,0.45)', gradiente: 'linear-gradient(90deg, #7d8694, #B8C0CC)' },
  { nome: 'Ouro I',         xpMin: 5000,    cor: '#E8B33D', corGlow: 'rgba(232,179,61,0.5)',   gradiente: 'linear-gradient(90deg, #a87a16, #E8B33D)' },
  { nome: 'Ouro II',        xpMin: 7500,    cor: '#E8B33D', corGlow: 'rgba(232,179,61,0.5)',   gradiente: 'linear-gradient(90deg, #a87a16, #E8B33D)' },
  { nome: 'Ouro III',       xpMin: 10000,   cor: '#E8B33D', corGlow: 'rgba(232,179,61,0.5)',   gradiente: 'linear-gradient(90deg, #a87a16, #E8B33D)' },
  { nome: 'Platina I',      xpMin: 13000,   cor: '#4DD6C0', corGlow: 'rgba(77,214,192,0.5)',   gradiente: 'linear-gradient(90deg, #1f8a7a, #4DD6C0)' },
  { nome: 'Platina II',     xpMin: 16000,   cor: '#4DD6C0', corGlow: 'rgba(77,214,192,0.5)',   gradiente: 'linear-gradient(90deg, #1f8a7a, #4DD6C0)' },
  { nome: 'Platina III',    xpMin: 20000,   cor: '#4DD6C0', corGlow: 'rgba(77,214,192,0.5)',   gradiente: 'linear-gradient(90deg, #1f8a7a, #4DD6C0)' },
  { nome: 'Diamante I',     xpMin: 24000,   cor: '#5AC8FA', corGlow: 'rgba(90,200,250,0.5)',   gradiente: 'linear-gradient(90deg, #1b6fa3, #5AC8FA)' },
  { nome: 'Diamante II',    xpMin: 29000,   cor: '#5AC8FA', corGlow: 'rgba(90,200,250,0.5)',   gradiente: 'linear-gradient(90deg, #1b6fa3, #5AC8FA)' },
  { nome: 'Diamante III',   xpMin: 35000,   cor: '#5AC8FA', corGlow: 'rgba(90,200,250,0.5)',   gradiente: 'linear-gradient(90deg, #1b6fa3, #5AC8FA)' },
  { nome: 'Rubi I',         xpMin: 42000,   cor: '#FF4D6A', corGlow: 'rgba(255,77,106,0.5)',   gradiente: 'linear-gradient(90deg, #99102a, #FF4D6A)' },
  { nome: 'Rubi II',        xpMin: 50000,   cor: '#FF4D6A', corGlow: 'rgba(255,77,106,0.5)',   gradiente: 'linear-gradient(90deg, #99102a, #FF4D6A)' },
  { nome: 'Rubi III',       xpMin: 60000,   cor: '#FF4D6A', corGlow: 'rgba(255,77,106,0.5)',   gradiente: 'linear-gradient(90deg, #99102a, #FF4D6A)' },
  { nome: 'Esmeralda I',    xpMin: 72000,   cor: '#34D27A', corGlow: 'rgba(52,210,122,0.5)',   gradiente: 'linear-gradient(90deg, #156b3c, #34D27A)' },
  { nome: 'Esmeralda II',   xpMin: 85000,   cor: '#34D27A', corGlow: 'rgba(52,210,122,0.5)',   gradiente: 'linear-gradient(90deg, #156b3c, #34D27A)' },
  { nome: 'Esmeralda III',  xpMin: 100000,  cor: '#34D27A', corGlow: 'rgba(52,210,122,0.5)',   gradiente: 'linear-gradient(90deg, #156b3c, #34D27A)' },
  { nome: 'Safira I',       xpMin: 120000,  cor: '#3D6BFF', corGlow: 'rgba(61,107,255,0.5)',   gradiente: 'linear-gradient(90deg, #15287a, #3D6BFF)' },
  { nome: 'Safira II',      xpMin: 145000,  cor: '#3D6BFF', corGlow: 'rgba(61,107,255,0.5)',   gradiente: 'linear-gradient(90deg, #15287a, #3D6BFF)' },
  { nome: 'Safira III',     xpMin: 175000,  cor: '#3D6BFF', corGlow: 'rgba(61,107,255,0.5)',   gradiente: 'linear-gradient(90deg, #15287a, #3D6BFF)' },
  { nome: 'Mestre I',       xpMin: 210000,  cor: '#B14DFF', corGlow: 'rgba(177,77,255,0.5)',   gradiente: 'linear-gradient(90deg, #5c1a8a, #B14DFF)' },
  { nome: 'Mestre II',      xpMin: 250000,  cor: '#B14DFF', corGlow: 'rgba(177,77,255,0.5)',   gradiente: 'linear-gradient(90deg, #5c1a8a, #B14DFF)' },
  { nome: 'Mestre III',     xpMin: 300000,  cor: '#B14DFF', corGlow: 'rgba(177,77,255,0.5)',   gradiente: 'linear-gradient(90deg, #5c1a8a, #B14DFF)' },
  { nome: 'Grão-Mestre I',  xpMin: 360000,  cor: '#FF3DBE', corGlow: 'rgba(255,61,190,0.5)',   gradiente: 'linear-gradient(90deg, #8a1668, #FF3DBE)' },
  { nome: 'Grão-Mestre II', xpMin: 430000,  cor: '#FF3DBE', corGlow: 'rgba(255,61,190,0.5)',   gradiente: 'linear-gradient(90deg, #8a1668, #FF3DBE)' },
  { nome: 'Grão-Mestre III',xpMin: 500000,  cor: '#FF3DBE', corGlow: 'rgba(255,61,190,0.5)',   gradiente: 'linear-gradient(90deg, #8a1668, #FF3DBE)' },
  { nome: 'Lendário I',     xpMin: 600000,  cor: '#FFD23D', corGlow: 'rgba(255,210,61,0.55)',  gradiente: 'linear-gradient(90deg, #8a6e10, #FFD23D)' },
  { nome: 'Lendário II',    xpMin: 750000,  cor: '#FFD23D', corGlow: 'rgba(255,210,61,0.55)',  gradiente: 'linear-gradient(90deg, #8a6e10, #FFD23D)' },
  { nome: 'Lendário III',   xpMin: 1000000, cor: '#FFD23D', corGlow: 'rgba(255,210,61,0.55)',  gradiente: 'linear-gradient(90deg, #8a6e10, #FFD23D)' },
  { nome: '🌌 Mítico',       xpMin: 1500000, cor: '#FFFFFF', corGlow: 'rgba(255,255,255,0.6)',  gradiente: 'linear-gradient(90deg, #B14DFF, #5AC8FA, #FFD23D)' },
]

export interface RankProgress {
  atual: RankDef
  proximo: RankDef | null
  xpAtual: number
  xpNoRankAtual: number
  xpNecessarioNoRank: number
  percentual: number
}

/** Calcula o rank atual, o próximo rank e o progresso percentual dentro do rank. */
export function calcularProgressoRank(xpAtual: number): RankProgress {
  let atual = RANKS[0]
  let proximo: RankDef | null = RANKS[1] ?? null

  for (let i = 0; i < RANKS.length; i++) {
    if (xpAtual >= RANKS[i].xpMin) {
      atual = RANKS[i]
      proximo = RANKS[i + 1] ?? null
    } else {
      break
    }
  }

  const xpNoRankAtual = xpAtual - atual.xpMin
  const xpNecessarioNoRank = proximo ? proximo.xpMin - atual.xpMin : 0
  const percentual = proximo
    ? Math.min(100, Math.max(0, (xpNoRankAtual / xpNecessarioNoRank) * 100))
    : 100 // rank máximo (Mítico) sempre 100%

  return { atual, proximo, xpAtual, xpNoRankAtual, xpNecessarioNoRank, percentual }
}