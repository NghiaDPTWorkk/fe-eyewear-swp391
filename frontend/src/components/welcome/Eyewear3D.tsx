import { useMemo, useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import { useGLTF, MeshWobbleMaterial } from '@react-three/drei'

import * as THREE from 'three'

export const Eyewear3D = () => {
  const modelRef = useRef<THREE.Group>(null)

  // Use a higher quality model if possible, or a well-known one
  // This is a common public model for standard shades/glasses
  const { scene } = useGLTF(
    'https://vazxmixjsiawhamurptp.supabase.co/storage/v1/object/public/models/shades/model.gltf'
  )

  // Improve materials for a "premium" look
  useMemo(() => {
    if (!scene) return
    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        // Metallic frame
        if (
          child.name.toLowerCase().includes('frame') ||
          child.name.toLowerCase().includes('metal')
        ) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#4ad7b0',
            metalness: 0.9,
            roughness: 0.1,
            envMapIntensity: 2
          })
        }
        // Glass lenses
        if (
          child.name.toLowerCase().includes('lens') ||
          child.name.toLowerCase().includes('glass')
        ) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: '#000000',
            metalness: 0.1,
            roughness: 0,
            transmission: 0.2, // Some transparency
            thickness: 0.5,
            clearcoat: 1,
            clearcoatRoughness: 0,
            envMapIntensity: 2
          })
        }
      }
    })
  }, [scene])

  // Automatic animation sequence (10s cycle)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()

    if (modelRef.current) {
      // Smooth rotation
      modelRef.current.rotation.y = Math.sin(t / 2) * 0.5
      modelRef.current.rotation.x = Math.cos(t / 4) * 0.2
      modelRef.current.rotation.z = Math.sin(t / 8) * 0.1

      // Heartbeat pulse every 5 seconds or just a gentle float
      const pulse = 1 + Math.sin(t * 2) * 0.05
      modelRef.current.scale.set(pulse, pulse, pulse)

      // Floating movement (up/down)
      modelRef.current.position.y = Math.sin(t) * 0.2
    }
  })

  return (
    <group ref={modelRef} dispose={null} scale={[1, 1, 1]} position={[0, 0, 0]}>
      {/* Fallback box if model fails to load, but using Suspense in parent */}
      <primitive object={scene} scale={2} />

      {/* Decorative aura/glow around the model */}
      <mesh position={[0, 0, -1]} rotation={[0, 0, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <MeshWobbleMaterial color="#4ad7b0" opacity={0.03} transparent speed={2} factor={0.4} />
      </mesh>
    </group>
  )
}

// Preload the model
useGLTF.preload(
  'https://vazxmixjsiawhamurptp.supabase.co/storage/v1/object/public/models/shades/model.gltf'
)
