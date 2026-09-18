'use client'

import { useEffect, useRef, useState } from 'react'

const KONAMI = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'b', 'a',
]

const EMOJIS = ['🌲', '🌳']

interface Tree {
  id: number
  emoji: string
  top: number
  left: number
  size: number
  delay: number
  swayDuration: number
}

function randomTrees(count: number): Tree[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
    top: Math.random() * 92,
    left: Math.random() * 96,
    size: 2 + Math.random() * 3,
    delay: Math.random() * 0.6,
    swayDuration: 2.5 + Math.random() * 2,
  }))
}

/**
 * Easter egg — ↑↑↓↓←→←→BA fait pousser une mini forêt à l'écran, avec une
 * ambiance sonore synthétisée (pas de fichier audio à charger). Un clic
 * n'importe où referme l'effet.
 */
export default function KonamiForest() {
  const [active, setActive] = useState(false)
  const [trees, setTrees] = useState<Tree[]>([])
  const buffer = useRef<string[]>([])

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.length === 1 ? e.key.toLowerCase() : e.key
      const next = [...buffer.current, key].slice(-KONAMI.length)
      buffer.current = next
      if (next.length === KONAMI.length && next.every((k, i) => k === KONAMI[i])) {
        buffer.current = []
        setTrees(randomTrees(26))
        setActive(true)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [])

  // Ambiance de forêt — bruit filtré pour le vent, bips aigus espacés au
  // hasard pour des chants d'oiseaux. Généré en Web Audio API : pas de piste
  // à héberger, et la frappe du code Konami sert de geste utilisateur pour
  // autoriser la lecture.
  useEffect(() => {
    if (!active) return

    const AudioContextCtor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioContextCtor()

    const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
    const data = noiseBuffer.getChannelData(0)
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1

    const noise = ctx.createBufferSource()
    noise.buffer = noiseBuffer
    noise.loop = true
    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 500
    const windGain = ctx.createGain()
    windGain.gain.value = 0.04
    noise.connect(filter).connect(windGain).connect(ctx.destination)
    noise.start()

    const birdTimeouts: ReturnType<typeof setTimeout>[] = []
    const scheduleBird = () => {
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.type = 'sine'
      const freq = 1800 + Math.random() * 1400
      osc.frequency.setValueAtTime(freq, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(freq * 0.6, ctx.currentTime + 0.15)
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(0.05, ctx.currentTime + 0.02)
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.18)
      osc.connect(gain).connect(ctx.destination)
      osc.start()
      osc.stop(ctx.currentTime + 0.2)

      birdTimeouts.push(setTimeout(scheduleBird, 800 + Math.random() * 2200))
    }
    birdTimeouts.push(setTimeout(scheduleBird, 500))

    return () => {
      birdTimeouts.forEach(clearTimeout)
      noise.stop()
      ctx.close()
    }
  }, [active])

  if (!active) return null

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label="Fermer la forêt"
      className="fixed inset-0 z-[200] cursor-pointer"
      onClick={() => setActive(false)}
      onKeyDown={(e) => e.key === 'Enter' && setActive(false)}
    >
      {trees.map((t) => (
        <span
          key={t.id}
          className="konami-tree-enter absolute select-none"
          style={{ top: `${t.top}%`, left: `${t.left}%`, animationDelay: `${t.delay}s` }}
        >
          <span
            className="konami-tree-sway"
            style={{ fontSize: `${t.size}rem`, animationDuration: `${t.swayDuration}s`, animationDelay: `${t.delay}s` }}
          >
            {t.emoji}
          </span>
        </span>
      ))}
    </div>
  )
}
