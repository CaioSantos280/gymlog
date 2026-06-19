'use client'

/**
 * Keyframes globais usados pelos componentes RPG (anel giratório de moldura, etc).
 * Renderize <GlobalAnimations /> uma vez no layout raiz (app/layout.tsx).
 */
export function GlobalAnimations() {
  return (
    <style jsx global>{`
      @keyframes gymlog-spin {
        from {
          transform: rotate(0deg);
        }
        to {
          transform: rotate(360deg);
        }
      }
    `}</style>
  )
}