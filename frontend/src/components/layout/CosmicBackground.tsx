import React, { useState, useEffect, useRef, Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { Stars, Sparkles, Environment } from '@react-three/drei'

interface TrailPoint {
  x: number
  y: number
  id: number
  time: number
}

interface CosmicBackgroundProps {
  children?: React.ReactNode
  showStars?: boolean
  showSparkles?: boolean
  showMouseTrail?: boolean
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  children,
  showStars = true,
  showSparkles = true,
  showMouseTrail = true
}) => {
  const [trail, setTrail] = useState<TrailPoint[]>([])
  const [currentTime, setCurrentTime] = useState(() => Date.now())
  const pointIdRef = useRef(0)

  useEffect(() => {
    if (!showMouseTrail) return

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
      clearInterval(cleanupLoop)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [showMouseTrail])

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black transition-opacity duration-1000">
      {/* Immersive Galaxy Background Layer */}
      <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden bg-black">
        {/* Central Dedicated Mint Glow */}
        <div className="absolute left-1/2 top-1/2 h-[70vw] w-[70vw] -translate-x-1/2 -translate-y-1/2 animate-pulse bg-[radial-gradient(circle,rgba(74,215,176,0.25)_0%,transparent_70%)] opacity-80 blur-[80px]" />
      </div>

      {/* Persistent Mouse Trail */}
      {showMouseTrail && (
        <div className="pointer-events-none absolute inset-0 z-10 overflow-hidden">
          {trail.map((p) => {
            const age = currentTime - p.time
            const opacity = Math.max(0, 0.22 - age / 3500)
            return (
              <div
                key={p.id}
                className="pointer-events-none absolute transition-opacity duration-500"
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
      )}

      {/* Main 3D Canvas */}
      <div className="pointer-events-none absolute inset-0 z-20">
        <Canvas
          shadows
          camera={{ position: [0, 0, 4], fov: 38 }}
          dpr={[1, 2]}
          gl={{ alpha: true, antialias: true }}
        >
          <ambientLight intensity={0.6} />
          <Suspense fallback={null}>
            {showStars && (
              <Stars
                radius={120}
                depth={60}
                count={2000}
                factor={8}
                saturation={1}
                fade
                speed={0.6}
              />
            )}
            {showSparkles && (
              <>
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
              </>
            )}
            <Environment preset="night" />
          </Suspense>
        </Canvas>
      </div>

      {/* Content Overlay */}
      <div className="relative z-30 flex min-h-screen flex-col">{children}</div>
    </div>
  )
}
