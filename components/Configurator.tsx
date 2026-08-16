'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import type {
  ChoiceParam,
  FurnitureConfig,
  FurnitureKey,
  MaterialKey,
  NumberParam,
  ParamDef,
  ParamValue,
  ToggleParam,
} from '@/types'
import { MATERIALS, OPTIONS } from '@/lib/constants'
import { FURNITURE, FURNITURE_KEYS, initialConfigs } from '@/lib/furniture'
import { calcPrix, formatPrice } from '@/lib/pricing'
import { SCHEMATICS } from './Schematics'
import { useDevis } from './DevisProvider'
import { resumeDevis } from '@/lib/devis'

const MATERIAL_KEYS = Object.keys(MATERIALS) as MaterialKey[]

/**
 * Place la caméra pour que le plus grand meuble possible du type courant tienne
 * dans le cadre. Le cadrage ne dépend que du type : à l'intérieur d'un meuble,
 * la caméra ne bouge plus, et la taille apparente ne saute pas quand on tire un
 * curseur.
 */
function frameCamera(
  camera: THREE.PerspectiveCamera,
  dims: { w: number; h: number; d: number },
) {
  const fov = (camera.fov * Math.PI) / 180
  // Largeur apparente maximale une fois le meuble pivoté (diagonale au sol)
  const horiz = Math.hypot(dims.w, dims.d)
  const fitH = dims.h / 2 / Math.tan(fov / 2)
  const fitW = horiz / 2 / (Math.tan(fov / 2) * camera.aspect)
  const dist = Math.max(fitH, fitW) * 1.08 + dims.d / 2
  camera.position.set(0, 0, dist)
  camera.lookAt(0, 0, 0)
}

export default function Configurator() {
  const [type, setType] = useState<FurnitureKey>('placard')
  // Une configuration mémorisée par type : revenir sur un meuble déjà réglé
  // restitue ses mesures.
  const [store, setStore] = useState<Record<FurnitureKey, FurnitureConfig>>(initialConfigs)
  // Le matériau, lui, est commun : le choix d'essence vaut pour tout le catalogue.
  const [materiau, setMateriau] = useState<MaterialKey>('chene')

  const { deposerBrouillon } = useDevis()

  const meuble = FURNITURE[type]
  const config = store[type]

  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene>()
  const rendererRef = useRef<THREE.WebGLRenderer>()
  const cameraRef = useRef<THREE.PerspectiveCamera>()
  const objectRef = useRef<THREE.Group>()
  const dimsRef = useRef(FURNITURE.placard.maxDims)
  const rotationRef = useRef({ y: -0.5, x: 0.1 })

  // Init de la scène (une seule fois)
  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const width = mount.clientWidth
    const height = mount.clientHeight

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f1ea)

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    frameCamera(camera, dimsRef.current)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setSize(width, height)
    mount.appendChild(renderer.domElement)

    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const dir = new THREE.DirectionalLight(0xffffff, 0.9)
    dir.position.set(3, 5, 4)
    scene.add(dir)
    const fill = new THREE.DirectionalLight(0xffffff, 0.3)
    fill.position.set(-4, 2, -3)
    scene.add(fill)

    sceneRef.current = scene
    cameraRef.current = camera
    rendererRef.current = renderer

    // Rotation à la souris
    let dragging = false
    let lastX = 0
    let lastY = 0
    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
    }
    const onUp = () => {
      dragging = false
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      rotationRef.current.y += (e.clientX - lastX) * 0.01
      rotationRef.current.x = Math.max(
        -0.6,
        Math.min(0.6, rotationRef.current.x + (e.clientY - lastY) * 0.01),
      )
      lastX = e.clientX
      lastY = e.clientY
    }
    const el = renderer.domElement
    el.style.cursor = 'grab'
    el.style.touchAction = 'none' // permet le pivot tactile sans scroller la page
    el.addEventListener('pointerdown', onDown)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointermove', onMove)

    let raf = 0
    const animate = () => {
      raf = requestAnimationFrame(animate)
      if (objectRef.current) {
        objectRef.current.rotation.y = rotationRef.current.y
        objectRef.current.rotation.x = rotationRef.current.x
      }
      renderer.render(scene, camera)
    }
    animate()

    const onResize = () => {
      const w = mount.clientWidth
      const h = mount.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
      frameCamera(camera, dimsRef.current)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerdown', onDown)
      renderer.dispose()
      if (el.parentNode) el.parentNode.removeChild(el)
    }
  }, [])

  // Recadrage au changement de type uniquement
  useEffect(() => {
    dimsRef.current = FURNITURE[type].maxDims
    const camera = cameraRef.current
    if (camera) frameCamera(camera, dimsRef.current)
  }, [type])

  // Reconstruit le meuble à chaque changement de type, de mesure ou d'essence
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    if (objectRef.current) {
      scene.remove(objectRef.current)
      objectRef.current.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose()
          ;(obj.material as THREE.Material).dispose()
        }
      })
    }

    const built = FURNITURE[type].build(config, MATERIALS[materiau].color)
    objectRef.current = built
    scene.add(built)
  }, [type, config, materiau])

  const update = (key: string, value: ParamValue) =>
    setStore((prev) => ({ ...prev, [type]: { ...prev[type], [key]: value } }))

  const prix = calcPrix(type, config, materiau)
  const options = OPTIONS.filter((o) => meuble.options.includes(o.key))

  return (
    <section id="configurateur" className="bg-cream px-6 md:px-12 py-20 md:py-28">
      <div className="max-w-6xl mx-auto">
        <p className="text-brand text-[0.7rem] font-medium tracking-[0.15em] uppercase mb-4">
          Configurateur
        </p>
        <h2
          className="font-playfair text-charcoal font-normal leading-tight mb-8"
          style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
        >
          Composez votre meuble<br />et obtenez un prix instantané
        </h2>

        {/* Présélection du type de meuble */}
        <div className="text-charcoal text-xs uppercase tracking-widest mb-3">
          Quel meuble souhaitez-vous ?
        </div>
        <div className="-mx-6 md:mx-0 px-6 md:px-0 overflow-x-auto">
          <div className="flex gap-3 min-w-max pb-1">
            {FURNITURE_KEYS.map((key) => {
              const Schema = SCHEMATICS[key]
              const active = key === type
              return (
                <button
                  key={key}
                  onClick={() => setType(key)}
                  aria-pressed={active}
                  className={`flex-none w-[120px] flex flex-col items-center gap-2 p-3 rounded-sm border transition-colors ${
                    active
                      ? 'border-brand bg-white'
                      : 'border-brand/20 bg-white/40 hover:border-brand/50'
                  }`}
                >
                  <span
                    className={`w-full aspect-square ${active ? 'text-brand' : 'text-muted'}`}
                  >
                    <Schema />
                  </span>
                  <span className="text-charcoal text-[0.7rem] text-center leading-tight">
                    {FURNITURE[key].label}
                  </span>
                </button>
              )
            })}

            {/* Sortie de secours : ce que le configurateur ne sait pas dessiner
                se raconte au formulaire, sans rien pré-remplir. */}
            <a
              href="#contact"
              onClick={() => deposerBrouillon('')}
              className="flex-none w-[120px] flex flex-col items-center gap-2 p-3 rounded-sm border border-dashed border-brand/40 text-muted hover:border-brand hover:text-brand transition-colors"
            >
              <span className="w-full aspect-square flex items-center justify-center">
                <svg
                  viewBox="0 0 120 120"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.3}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-full h-full"
                  aria-hidden="true"
                >
                  <rect x="16" y="24" width="88" height="72" rx="3" strokeDasharray="5 4" />
                  <path d="M60 46 V74 M46 60 H74" />
                </svg>
              </span>
              <span className="text-charcoal text-[0.7rem] text-center leading-tight">
                Autre projet
              </span>
            </a>
          </div>
        </div>
        <p className="text-muted text-xs mt-2">
          Neuf familles au catalogue — faites défiler pour toutes les voir. Votre
          projet n&apos;y figure pas&nbsp;? Choisissez «&nbsp;Autre projet&nbsp;».
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mt-10">
          {/* Aperçu 3D */}
          <div className="flex flex-col gap-3">
            <div
              ref={mountRef}
              className="w-full aspect-square lg:aspect-auto lg:h-[460px] bg-cream border border-brand/20 rounded-sm overflow-hidden"
            />
            <p className="text-muted text-xs text-center">
              Cliquez-glissez pour faire pivoter le meuble
            </p>
          </div>

          {/* Contrôles */}
          <div className="flex flex-col gap-8">
            <div>
              <div className="flex items-baseline justify-between mb-1">
                <h3 className="font-playfair text-charcoal text-xl">{meuble.label}</h3>
              </div>
              <p className="text-muted text-sm leading-relaxed mb-5">{meuble.tagline}</p>

              <div className="flex flex-col gap-5">
                {meuble.params.map((param) => (
                  <ParamRow
                    key={param.key}
                    param={param}
                    value={config[param.key]}
                    onChange={(v) => update(param.key, v)}
                  />
                ))}
              </div>
            </div>

            {/* Matériaux */}
            <div>
              <div className="text-charcoal text-xs uppercase tracking-widest mb-3">
                Matériau
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {MATERIAL_KEYS.map((key) => {
                  const m = MATERIALS[key]
                  const active = materiau === key
                  return (
                    <button
                      key={key}
                      onClick={() => setMateriau(key)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-sm border transition-colors ${
                        active ? 'border-brand bg-white' : 'border-brand/20 hover:border-brand/50'
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full border border-black/10"
                        style={{ backgroundColor: m.hex }}
                      />
                      <span className="text-charcoal text-[0.7rem] text-center leading-tight">
                        {m.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Options — seulement celles qui concernent ce meuble */}
            {options.length > 0 && (
              <div>
                <div className="text-charcoal text-xs uppercase tracking-widest mb-3">
                  Options
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {options.map((opt) => {
                    const active = Boolean(config[opt.key])
                    return (
                      <label
                        key={opt.key}
                        className={`flex items-center justify-between gap-3 p-3 rounded-sm border cursor-pointer transition-colors ${
                          active ? 'border-brand bg-white' : 'border-brand/20 hover:border-brand/50'
                        }`}
                      >
                        <span className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            checked={active}
                            onChange={(e) => update(opt.key, e.target.checked)}
                            className="accent-brand"
                          />
                          <span className="text-charcoal text-sm">{opt.label}</span>
                        </span>
                        <span className="text-muted text-xs">+{opt.price} €</span>
                      </label>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Prix */}
            <div className="bg-charcoal rounded-sm p-6 text-white">
              <div className="flex flex-col gap-2 text-sm">
                <Row label="Structure" value={formatPrice(prix.pStructure)} />
                <Row label="Matériau" value={formatPrice(prix.pMateriau)} />
                <Row label="Options" value={formatPrice(prix.pOptions)} />
              </div>
              <div className="h-px bg-white/15 my-4" />
              <div className="flex items-end justify-between">
                <span className="text-white/60 text-xs uppercase tracking-widest">
                  Estimation totale
                </span>
                <span className="font-playfair text-brand text-3xl">
                  {formatPrice(prix.total)}
                </span>
              </div>
              <a
                href="#contact"
                onClick={() => deposerBrouillon(resumeDevis(type, config, materiau))}
                className="mt-5 block text-center bg-brand text-white text-sm font-medium px-8 py-3.5 rounded-sm hover:bg-brand-dark transition-colors"
              >
                Demander ce devis
              </a>
              <p className="text-white/45 text-xs text-center mt-3">
                Votre configuration sera recopiée dans le formulaire.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

/** Rend le contrôle correspondant au type de paramètre déclaré par le meuble. */
function ParamRow({
  param,
  value,
  onChange,
}: {
  param: ParamDef
  value: ParamValue
  onChange: (v: ParamValue) => void
}) {
  if (param.kind === 'number') {
    return <SliderRow param={param} value={Number(value)} onChange={onChange} />
  }
  if (param.kind === 'choice') {
    return <ChoiceRow param={param} value={String(value)} onChange={onChange} />
  }
  return <ToggleRow param={param} value={Boolean(value)} onChange={onChange} />
}

function SliderRow({
  param,
  value,
  onChange,
}: {
  param: NumberParam
  value: number
  onChange: (v: number) => void
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <span className="text-charcoal text-xs uppercase tracking-widest">{param.label}</span>
        <span className="text-brand text-sm font-medium">
          {value}
          {param.unit ?? ' cm'}
        </span>
      </div>
      <input
        type="range"
        className="range-brand w-full"
        min={param.min}
        max={param.max}
        step={param.step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  )
}

function ChoiceRow({
  param,
  value,
  onChange,
}: {
  param: ChoiceParam
  value: string
  onChange: (v: string) => void
}) {
  return (
    <div>
      <div className="text-charcoal text-xs uppercase tracking-widest mb-2">{param.label}</div>
      <div className="flex gap-2">
        {param.choices.map((choice) => {
          const active = choice.value === value
          return (
            <button
              key={choice.value}
              onClick={() => onChange(choice.value)}
              className={`flex-1 text-sm px-3 py-2 rounded-sm border transition-colors ${
                active
                  ? 'border-brand bg-white text-charcoal'
                  : 'border-brand/20 text-muted hover:border-brand/50'
              }`}
            >
              {choice.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

function ToggleRow({
  param,
  value,
  onChange,
}: {
  param: ToggleParam
  value: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label
      className={`flex items-center gap-3 p-3 rounded-sm border cursor-pointer transition-colors ${
        value ? 'border-brand bg-white' : 'border-brand/20 hover:border-brand/50'
      }`}
    >
      <input
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-brand"
      />
      <span className="text-charcoal text-sm">{param.label}</span>
    </label>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/55">{label}</span>
      <span className="text-white/90">{value}</span>
    </div>
  )
}
