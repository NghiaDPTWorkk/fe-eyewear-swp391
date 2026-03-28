import { Suspense, useMemo, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Stage, useGLTF, PerspectiveCamera } from '@react-three/drei'
import { normalizeGlassesModel } from './virtual-try-on/glassesModelNormalizer'
import { Maximize2, Minimize2, RotateCcw, X } from 'lucide-react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'

interface Product3DViewerProps {
  modelUrl: string
  containerClassName?: string
}

const GlassesModel = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url)

  const normalizedScene = useMemo(() => {
    const clone = scene.clone()
    normalizeGlassesModel(clone)
    return clone
  }, [scene])

  return <primitive object={normalizedScene} />
}

export const Product3DViewer = ({ modelUrl, containerClassName }: Product3DViewerProps) => {
  const [isFullScreen, setIsFullScreen] = useState(false)

  const ViewerContent = (
    <div className="relative w-full h-full flex flex-col">
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 0.5]} fov={40} />
        <Suspense fallback={null}>
          <Stage
            adjustCamera={1.2}
            intensity={0.5}
            environment="studio"
            preset="rembrandt"
            shadows={{ type: 'contact', opacity: 0.1, blur: 3 }}
          >
            <GlassesModel url={modelUrl} />
          </Stage>
        </Suspense>
        <OrbitControls
          makeDefault
          autoRotate={!isFullScreen}
          autoRotateSpeed={0.5}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          enableDamping
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Controls Overlay */}
      <div className="absolute top-6 right-6 flex flex-col gap-3">
        <button
          onClick={() => setIsFullScreen(!isFullScreen)}
          className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-mint-100 text-primary-600 hover:bg-primary-500 hover:text-white transition-all group active:scale-95"
          title={isFullScreen ? 'Exit Full Screen' : 'Full Screen View'}
        >
          {isFullScreen ? (
            <Minimize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          ) : (
            <Maximize2 className="w-5 h-5 group-hover:scale-110 transition-transform" />
          )}
        </button>
        <button
          onClick={() => window.location.reload()} // Simple reset by reload or we can use a ref
          className="p-3 bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-mint-100 text-gray-400 hover:text-primary-500 transition-all active:scale-95"
          title="Reset View"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
      </div>

      <div className="absolute bottom-6 left-6 flex flex-col gap-1 pointer-events-none">
        <div className="px-4 py-1.5 bg-primary-500/90 text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] shadow-lg shadow-primary-500/30 w-fit">
          360° Interactive View
        </div>
        <p className="text-[11px] text-gray-500/80 font-medium ml-1">
          Drag to rotate • Scroll to zoom
        </p>
      </div>
    </div>
  )

  if (isFullScreen) {
    return createPortal(
      <div className="fixed inset-0 z-[10000] bg-white flex flex-col animate-fade-in-up">
        {/* Header for Full Screen */}
        <div className="flex items-center justify-between px-8 py-4 border-b border-mint-100 bg-white/80 backdrop-blur-md z-10">
          <div className="flex flex-col">
            <h2 className="text-xl font-heading font-bold text-mint-1200">
              Interactive 3D Experience
            </h2>
            <p className="text-xs text-gray-eyewear font-medium uppercase tracking-widest opacity-60">
              Professional Optic Visualization
            </p>
          </div>
          <button
            onClick={() => setIsFullScreen(false)}
            className="p-2 hover:bg-mint-50 rounded-full transition-colors"
          >
            <X className="w-8 h-8 text-mint-1200" />
          </button>
        </div>

        <div className="flex-1 bg-mint-50/30">{ViewerContent}</div>

        {/* Footer for Full Screen */}
        <div className="px-8 py-4 border-t border-mint-100 bg-white/80 backdrop-blur-md text-center">
          <p className="text-sm font-medium text-gray-eyewear/60 italic">
            Experience the precision and craftsmanship of our eyewear from every angle.
          </p>
        </div>
      </div>,
      document.body
    )
  }

  return (
    <div
      className={cn(
        'w-full h-[500px] bg-gradient-to-br from-mint-50/50 to-white border border-mint-100 rounded-[2.5rem] overflow-hidden shadow-inner relative group/viewer',
        containerClassName
      )}
    >
      {ViewerContent}
    </div>
  )
}
