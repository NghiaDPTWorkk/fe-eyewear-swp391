import React, { useState, useEffect, Suspense, Component } from 'react'

import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import {
  Environment,
  PresentationControls,
  Float,
  ContactShadows,
  Text as DreiText,
  Stars,
  Sparkles
} from '@react-three/drei'

import { Eyewear3D } from '@/components/welcome/Eyewear3D'
import { Loading } from '@/shared/components/ui/loading'

// Error Boundary Component to handle 3D loading failures
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

// Fallback 3D shape if model fails to load
const FallbackBox = () => (
  <mesh rotation={[0, 45, 0]}>
    <boxGeometry args={[1.5, 0.8, 0.1]} />
    <meshStandardMaterial color="#4ad7b0" metalness={0.8} roughness={0.2} />
    <DreiText position={[0, 0, 0.1]} fontSize={0.1} color="white">
      Premium Eyewear
    </DreiText>
  </mesh>
)

export const WelcomePage = () => {
  const [showButton, setShowButton] = useState(false)
  const [isExiting, setIsExiting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Show button after 5 seconds
    const timer = setTimeout(() => {
      setShowButton(true)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleGoToWebsite = () => {
    setIsExiting(true)
    setTimeout(() => {
      navigate('/home')
    }, 1000) // Duration of exit animation
  }

  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-[#0d0d0d] transition-opacity duration-1000 ${isExiting ? 'opacity-0' : 'opacity-100'}`}
    >
      {/* Subtle Dynamic Background Gradient (Replaces Heavy SVG Noise) */}
      <div className="absolute inset-0 z-0 bg-radial-gradient from-[#1a1a1a] to-[#0d0d0d] opacity-50"></div>

      {/* Hero Typography - Behind the model */}
      <div className="absolute inset-0 flex items-center justify-center z-0 select-none overflow-hidden">
        <h1
          className="text-[20vw] font-black text-white/[0.03] leading-none tracking-tighter whitespace-nowrap transform -rotate-12 translate-x-10"
          style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
        >
          DOWNTOWN VISION
        </h1>
      </div>

      {/* 3D Background / Ambient Scene */}
      <div className="absolute inset-0 z-10 transition-transform duration-[2000ms] ease-out">
        <Canvas shadows camera={{ position: [0, 0, 4], fov: 40 }} dpr={[1, 2]}>
          <color attach="background" args={['#0d0d0d']} />
          <ambientLight intensity={0.4} />

          <Suspense fallback={null}>
            <Stars
              radius={100}
              depth={50}
              count={1000}
              factor={2}
              saturation={0}
              fade
              speed={0.2}
            />
            <Sparkles count={20} scale={6} size={1} speed={0.2} opacity={0.2} color="#4ad7b0" />

            {/* Optimized Essential Lighting */}
            <pointLight position={[5, 5, 2]} intensity={25} color="#ffffff" />
            <pointLight position={[-5, -5, 2]} intensity={15} color="#4ad7b0" />

            <ErrorBoundary fallback={<FallbackBox />}>
              <PresentationControls
                global
                rotation={[0, 0.4, 0]}
                polar={[-Math.PI / 4, Math.PI / 4]}
                azimuth={[-Math.PI / 2, Math.PI / 2]}
              >
                <Float speed={1.5} rotationIntensity={1} floatIntensity={1}>
                  <Eyewear3D />
                </Float>
              </PresentationControls>
            </ErrorBoundary>

            <ContactShadows
              position={[0, -1.8, 0]}
              opacity={0.7}
              scale={12}
              blur={2.5}
              far={4}
              color="#000000"
            />
            <Environment preset="night" />

            {/* Minimal Background Element */}
            <mesh position={[-8, 4, -12]}>
              <sphereGeometry args={[4, 32, 32]} />
              <meshBasicMaterial color="#4ad7b0" opacity={0.02} transparent />
            </mesh>
          </Suspense>
        </Canvas>
      </div>

      {/* Foreground Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-16 pointer-events-none z-20">
        {/* Branding */}
        <div
          className={`mt-10 transition-all duration-[1500ms] delay-500 transform ${showButton ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}
        >
          <div className="flex flex-col items-center">
            <span className="text-[#4ad7b0] font-mono text-sm tracking-[0.5em] mb-4 uppercase pl-[0.5em]">
              Immersive 2026
            </span>
            <h2 className="text-4xl md:text-6xl font-black text-white tracking-widest uppercase">
              REVEALING <span className="italic">THE FUTURE</span>
            </h2>
          </div>
        </div>

        {/* Dynamic Action Button */}
        <div
          className={`mb-10 transition-all duration-[1000ms] ease-out transform ${showButton ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'}`}
        >
          {showButton && (
            <div className="flex flex-col items-center gap-6">
              <button
                id="welcome-go-btn"
                onClick={handleGoToWebsite}
                className="pointer-events-auto relative group flex items-center justify-center p-1"
              >
                <span className="absolute inset-0 bg-white rounded-full transition-transform duration-500 group-hover:scale-105 opacity-0 group-hover:opacity-10"></span>
                <span className="relative bg-transparent border border-white/30 text-white font-bold py-5 px-14 rounded-full text-lg tracking-[0.2em] transition-all duration-500 uppercase flex items-center gap-4 hover:bg-white hover:text-black hover:border-white">
                  START THE EXPERIENCE
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </span>
              </button>

              <div className="text-white/30 font-mono text-[10px] tracking-[0.3em] uppercase">
                Explore Downtown Vision in 3D
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Screen Edge Decor */}
      <div className="absolute top-1/2 -left-32 -rotate-90 text-white/10 font-mono text-xs tracking-widest select-none z-30">
        01 / 04 — AUTHENTIC VISIONARY GEAR
      </div>
      <div className="absolute top-1/2 -right-32 rotate-90 text-white/10 font-mono text-xs tracking-widest select-none z-30">
        LAT 51.5074° N — LONG 0.1278° W
      </div>

      <Suspense fallback={<Loading />}>
        <div className="hidden" />
      </Suspense>
    </div>
  )
}
