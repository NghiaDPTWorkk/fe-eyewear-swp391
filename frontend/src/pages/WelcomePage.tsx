import React, { useState, useEffect, Suspense, Component } from 'react'

import { useNavigate } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import {
  Environment,
  PresentationControls,
  Float,
  ContactShadows,
  MeshDistortMaterial,
  Text as DreiText
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

    // Optional: Auto redirect after 10 seconds if user doesn't click (or just keep it)
    // The user said "Animation tự động tự chuyển động trong 10s", but didn't explicitly say auto-redirect.
    // I'll keep the button and allow user to stay or click.

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
      className={`relative w-full h-screen overflow-hidden bg-[#0a1118] transition-opacity duration-1000 ${isExiting ? 'opacity-0 scale-105' : 'opacity-100'}`}
    >
      {/* 3D Background / Ambient Scene */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
          <color attach="background" args={['#0a1118']} />
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

          <Suspense fallback={null}>
            <ErrorBoundary fallback={<FallbackBox />}>
              <PresentationControls
                global
                rotation={[0, 0.3, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 1.4]}
              >
                <Float speed={2} rotationIntensity={1.5} floatIntensity={1.5}>
                  <Eyewear3D />
                </Float>
              </PresentationControls>
            </ErrorBoundary>

            <ContactShadows position={[0, -1.5, 0]} opacity={0.4} scale={10} blur={2} far={4.5} />
            <Environment preset="city" />

            {/* Ambient Particles or Decorative Elements */}
            <mesh position={[-5, 2, -5]}>
              <sphereGeometry args={[1, 32, 32]} />
              <MeshDistortMaterial
                color="#4ad7b0"
                speed={5}
                distort={0.5}
                opacity={0.1}
                transparent
              />
            </mesh>
            <mesh position={[5, -2, -3]}>
              <sphereGeometry args={[0.8, 32, 32]} />
              <MeshDistortMaterial
                color="#043026"
                speed={3}
                distort={0.4}
                opacity={0.2}
                transparent
              />
            </mesh>
          </Suspense>
        </Canvas>
      </div>

      {/* Hero Content */}
      <div className="absolute inset-0 flex flex-col items-center justify-between py-20 pointer-events-none z-10">
        <div
          className={`text-center transition-all duration-1000 transform ${showButton ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}
        >
          <h1 className="text-6xl md:text-8xl font-heading font-black text-white tracking-tighter mb-4">
            DOWNTOWN <span className="text-[#4ad7b0]">VISION</span>
          </h1>
          <p className="text-gray-400 text-lg md:text-xl font-light tracking-widest uppercase">
            Experience Premium Eyewear in 3D
          </p>
        </div>

        {/* Action Button */}
        <div
          className={`transition-all duration-700 ease-out transform ${showButton ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-90'}`}
        >
          {showButton && (
            <button
              id="welcome-go-btn"
              onClick={handleGoToWebsite}
              className="pointer-events-auto bg-[#4ad7b0] hover:bg-[#3bc09b] text-[#043026] font-bold py-4 px-12 rounded-full text-xl shadow-2xl transition-all hover:scale-110 active:scale-95 flex items-center gap-3 group"
            >
              GO TO OUR WEBSITE
              <svg
                className="w-6 h-6 transform group-hover:translate-x-2 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </button>
          )}
        </div>

        {/* Decorative elements */}
        <div className="absolute bottom-10 left-10 text-white/20 text-xs font-mono tracking-widest hidden md:block">
          DOWNTOWN VISION © 2026 / IMMERSIVE EXPERIENCE
        </div>
        <div className="absolute bottom-10 right-10 text-white/20 text-xs font-mono tracking-widest hidden md:block">
          REVEALING THE FUTURE OF OPTICS
        </div>
      </div>

      {/* Initial Loading Overlay */}
      <Suspense fallback={<Loading />}>
        {/* The Canvas itself handles its own suspense, but we wrap for the whole page */}
      </Suspense>
    </div>
  )
}
