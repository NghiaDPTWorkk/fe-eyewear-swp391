import { useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import * as THREE from 'three'

interface GlassesOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  landmarksRef: React.RefObject<NormalizedLandmark[][]>
  glassesImageUrl: string
}

// Key landmark indices
const LEFT_EYE_OUTER = 33
const RIGHT_EYE_OUTER = 263
const NOSE_BRIDGE = 6
const LEFT_TEMPLE = 127
const RIGHT_TEMPLE = 356

export default function GlassesOverlay({
  videoRef,
  landmarksRef,

  glassesImageUrl: _glassesImageUrl
}: GlassesOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
      <Canvas
        gl={{ alpha: true, antialias: true }}
        camera={{ position: [0, 0, 5], fov: 50 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.8} />
        <directionalLight position={[2, 2, 5]} intensity={1.2} />
        <directionalLight position={[-2, -1, 3]} intensity={0.4} />
        <GlassesModel videoRef={videoRef} landmarksRef={landmarksRef} />
      </Canvas>
    </div>
  )
}

// --- Procedural 3D Glasses Model ---
function GlassesModel({
  videoRef,
  landmarksRef
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  landmarksRef: React.RefObject<NormalizedLandmark[][]>
}) {
  const groupRef = useRef<THREE.Group>(null)

  useFrame(({ viewport }) => {
    const group = groupRef.current
    const faces = landmarksRef.current
    const video = videoRef.current

    if (!group || !faces || faces.length === 0 || !video) {
      if (group) group.visible = false
      return
    }

    const face = faces[0]
    const leftTemple = face[LEFT_TEMPLE]
    const rightTemple = face[RIGHT_TEMPLE]
    const leftEye = face[LEFT_EYE_OUTER]
    const rightEye = face[RIGHT_EYE_OUTER]
    const noseBridge = face[NOSE_BRIDGE]

    if (!leftTemple || !rightTemple || !leftEye || !rightEye || !noseBridge) {
      group.visible = false
      return
    }

    group.visible = true

    // Convert normalized [0,1] coords to Three.js viewport coords
    // MediaPipe: (0,0) top-left, (1,1) bottom-right
    // Three.js viewport: center is (0,0), x goes right, y goes up
    const w = viewport.width
    const h = viewport.height

    const toWorld = (lm: NormalizedLandmark) => ({
      x: (lm.x - 0.5) * w,
      y: -(lm.y - 0.5) * h,
      z: -lm.z * w * 0.5
    })

    const nose = toWorld(noseBridge)
    const le = toWorld(leftEye)
    const re = toWorld(rightEye)
    const lt = toWorld(leftTemple)
    const rt = toWorld(rightTemple)

    // Center at nose bridge
    group.position.set(nose.x, nose.y, nose.z)

    // Scale based on temple distance
    const templeDist = Math.sqrt((rt.x - lt.x) ** 2 + (rt.y - lt.y) ** 2 + (rt.z - lt.z) ** 2)
    const scale = templeDist * 0.38
    group.scale.set(scale, scale, scale)

    // Rotation from eye line
    const dx = re.x - le.x
    const dy = re.y - le.y
    const dz = re.z - le.z
    group.rotation.z = Math.atan2(dy, dx)
    group.rotation.y = Math.atan2(-dz, Math.sqrt(dx * dx + dy * dy)) * 0.6
  })

  return (
    <group ref={groupRef} visible={false}>
      {/* Left lens frame */}
      <mesh position={[-0.65, 0, 0]}>
        <torusGeometry args={[0.52, 0.06, 16, 48]} />
        <meshStandardMaterial color="red" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Right lens frame */}
      <mesh position={[0.65, 0, 0]}>
        <torusGeometry args={[0.52, 0.06, 16, 48]} />
        <meshStandardMaterial color="red" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Left lens (transparent) */}
      <mesh position={[-0.65, 0, 0]}>
        <circleGeometry args={[0.48, 48]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Right lens (transparent) */}
      <mesh position={[0.65, 0, 0]}>
        <circleGeometry args={[0.48, 48]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.15} side={THREE.DoubleSide} />
      </mesh>

      {/* Bridge */}
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.035, 0.035, 0.3, 8]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.15, 0]} rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.15, 0.035, 8, 16, Math.PI]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Left temple arm */}
      <mesh position={[-1.15, 0.15, -0.8]} rotation={[0, 0.3, 0]}>
        <boxGeometry args={[0.06, 0.06, 1.6]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Right temple arm */}
      <mesh position={[1.15, 0.15, -0.8]} rotation={[0, -0.3, 0]}>
        <boxGeometry args={[0.06, 0.06, 1.6]} />
        <meshStandardMaterial color="#1a1a2e" metalness={0.7} roughness={0.3} />
      </mesh>
    </group>
  )
}
