import React, { useState, useEffect, Suspense, Component, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import {
  Environment,
  PresentationControls,
  Float,
  ContactShadows,
  Stars,
  Sparkles
} from '@react-three/drei'

import { Eyewear3D } from '@/components/welcome/Eyewear3D'

// Error Boundary
class ErrorBoundary extends Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    if (this.state.hasError) return this.props.fallback
    return this.props.children
  }
}

const FallbackBox = () => (
  <mesh rotation={[0, 45, 0]}>
    <boxGeometry args={[1.5, 0.8, 0.1]} />
    <meshStandardMaterial color="#ffffff" metalness={0.8} roughness={0.2} />
  </mesh>
)

// Letter Reveal Helper Component - Optimized for no-flash entrance
const StaggeredText = ({
  text,
  delayOffset = 0,
  className = ''
}: {
  text: string
  delayOffset?: number
  className?: string
}) => {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block opacity-0 translate-y-2 transition-all duration-[1000ms] cubic-bezier(0.16, 1, 0.3, 1)"
          style={{
            animation: `revealLetter 1000ms cubic-bezier(0.16, 1, 0.3, 1) forwards`,
            animationDelay: `${delayOffset + i * 40}ms`
          }}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
      <style>{`
        @keyframes revealLetter {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </span>
  )
}

interface TrailPoint {
  x: number
  y: number
  id: number
  time: number
}

export const WelcomePage = () => {
  const [showContent, setShowContent] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [currentTime, setCurrentTime] = useState(() => Date.now())
  const navigate = useNavigate()
  const pointIdRef = useRef(0)

  useEffect(() => {
    // Reveal content after a short delay
    const timer = setTimeout(() => setShowContent(true), 800)

    const handleMouseMove = (e: MouseEvent) => {
      const newPoint = {
        x: e.clientX,
        y: e.clientY,
        id: ++pointIdRef.current,
        time: Date.now()
      }
      setTrail((prev) => [...prev.slice(-60), newPoint])
    }

    const cleanupLoop = setInterval(() => {
      const now = Date.now()
      setCurrentTime(now)
      setTrail((prev) => prev.filter((p) => now - p.time < 3500))
    }, 50)

    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      clearTimeout(timer)
      clearInterval(cleanupLoop)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  const handleGoToWebsite = () => {
    setIsExiting(true)
    setTimeout(() => navigate('/home'), 1200)
  }

  return (
    <div
      style={{ backgroundColor: '#000' }} // Force black background immediately
      className={`relative w-full h-screen overflow-hidden transition-opacity duration-1000 cursor-default ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Immersive Galaxy Background Layer (z-0) */}
      <div className="absolute inset-0 z-0 bg-black overflow-hidden pointer-events-none">
        {/* Central Dedicated Mint Glow ONLY */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] bg-[radial-gradient(circle,rgba(74,215,176,0.25)_0%,transparent_70%)] opacity-80 blur-[80px] animate-pulse"></div>
      </div>

      {/* Persistent Mouse Trail (z-10) */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        {trail.map((p) => {
          const age = currentTime - p.time
          const opacity = Math.max(0, 0.22 - age / 3500)
          return (
            <div
              key={p.id}
              className="absolute pointer-events-none transition-opacity duration-500"
              style={{
                left: p.x,
                top: p.y,
                transform: `translate(-50%, -50%) scale(${1 - age / 4500})`,
                width: '180px',
                height: '180px',
                background: 'radial-gradient(circle, rgba(74,215,176,0.25) 0%, transparent 70%)',
                filter: 'blur(35px)',
                opacity: opacity,
                mixBlendMode: 'screen'
              }}
            />
          )
        })}
      </div>

      {/* Main 3D Canvas (z-20) */}
      <div className="absolute inset-0 z-20 pointer-events-none">
        <Canvas
          shadows
          camera={{ position: [0, 0, 4], fov: 38 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.6} />
          <Suspense fallback={null}>
            <Stars
              radius={120}
              depth={60}
              count={2000}
              factor={8}
              saturation={1}
              fade
              speed={0.6}
            />
            <Sparkles
              count={200}
              scale={20}
              size={8}
              speed={1.2}
              opacity={0.6}
              color="#4ad7b0"
              noise={1}
            />
            <Sparkles
              count={50}
              scale={15}
              size={15}
              speed={1.5}
              opacity={0.5}
              color="#ffffff"
              noise={1}
            />

            <spotLight
              position={[0, 10, 5]}
              intensity={120}
              angle={0.3}
              penumbra={1}
              color="#ffffff"
            />
            <pointLight position={[3, 2, 2]} intensity={60} color="#ffffff" />
            <pointLight position={[-3, -2, 2]} intensity={40} color="#4ad7b0" />

            <ErrorBoundary fallback={<FallbackBox />}>
              <PresentationControls
                global
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 8, Math.PI / 8]}
                azimuth={[-Math.PI / 6, Math.PI / 6]}
              >
                <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
                  <Eyewear3D />
                </Float>
              </PresentationControls>
            </ErrorBoundary>
            <ContactShadows
              position={[0, -1.8, 0]}
              opacity={0.6}
              scale={10}
              blur={3}
              far={4}
              color="#000000"
            />
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 z-30 flex flex-col items-center pointer-events-none">
        <div
          className={`mt-[12vh] flex flex-col items-center transition-all duration-[2000ms] cubic-bezier(0.16, 1, 0.3, 1) ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        >
          <div className="mb-4 px-4 py-1 border border-white/10 bg-white/5 backdrop-blur-md rounded-full text-[10px] tracking-[0.4em] text-white/40 uppercase font-mono">
            Downtown Vision / Optic
          </div>

          <h1 className="text-6xl md:text-[5rem] font-thin text-white tracking-[-0.03em] leading-tight text-center min-h-[6rem]">
            {/* Staggered Letter Reveal - Only render when showContent is true */}
            {showContent && (
              <>
                <StaggeredText text="The Future of" delayOffset={500} />{' '}
                <StaggeredText
                  text="Vision."
                  delayOffset={1200}
                  className="font-bold text-[#4ad7b0] drop-shadow-[0_0_35px_rgba(74,215,176,0.7)]"
                />
              </>
            )}
          </h1>
        </div>

        <div className="mt-auto mb-[10vh] flex flex-col items-center">
          <p
            className={`mb-10 text-white/20 max-w-md text-center text-sm font-light leading-relaxed tracking-wide px-6 transition-all duration-[1500ms] delay-500 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
          >
            Embark on a journey through precision and luxury. Experience eyewear crafted from the
            stars.
          </p>
          <div
            className={`transition-all duration-[1500ms] delay-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          >
            <button
              onClick={handleGoToWebsite}
              className="pointer-events-auto cursor-default relative group flex items-center justify-center overflow-hidden"
            >
              <div className="absolute inset-0 border border-white/10 bg-white/5 backdrop-blur-xl rounded-full transition-all duration-500 group-hover:bg-white group-hover:border-white"></div>
              <div className="relative px-12 py-5 font-semibold text-white/80 group-hover:text-black tracking-[0.2em] transition-colors duration-500 uppercase text-xs flex items-center gap-4">
                Shopping Now
                <svg
                  className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-1"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                  />
                </svg>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
