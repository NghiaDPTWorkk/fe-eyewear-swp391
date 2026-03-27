import { useMemo, useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

import * as THREE from 'three'

export const Eyewear3D = () => {
  const modelRef = useRef<THREE.Group>(null)

  // Use a higher quality model if possible, or a well-known one
  // This is a common public model for standard shades/glasses
  // Use local model
  // Use model2 for a realistic textured look
  const { scene } = useGLTF('/models/model2.glb')

  // Material setup (Memoized)
  useMemo(() => {
    if (!scene) return

    // Normalize and center the scene internally
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.sub(center)

    scene.traverse((child) => {
      const name = child.name.toLowerCase()
      if (child instanceof THREE.Mesh) {
        // High-end Metallic Texture
        if (name.includes('frame') || name.includes('metal') || name.includes('body')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#a0a0a0',
            metalness: 1,
            roughness: 0.1,
            envMapIntensity: 2
          })
        }
        // Premium Lens Texture
        if (name.includes('lens') || name.includes('glass')) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: '#050505',
            metalness: 0.5,
            roughness: 0.05,
            transmission: 0.6,
            thickness: 1,
            transparent: true,
            opacity: 0.95,
            envMapIntensity: 3
          })
        }
      }
    })
  }, [scene])

  // Collect arms for animation
  const arms = useMemo(() => {
    if (!scene) return []
    const results: THREE.Object3D[] = []
    scene.traverse((child) => {
      const name = child.name.toLowerCase()
      if (name.includes('arm') || name.includes('temple') || name.includes('side')) {
        results.push(child)
      }
    })
    return results
  }, [scene])

  // Animation Sequence
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!modelRef.current) return

    if (t < 3) {
      // 1. Entrance (Slide in from right)
      const progress = t / 3
      modelRef.current.position.x = 8 * (1 - progress)

      // Gradually unfold arms
      arms.forEach((arm) => {
        const isLeft = arm.position.x < 0
        const foldAngle = isLeft ? -Math.PI / 2 : Math.PI / 2
        arm.rotation.y = foldAngle * (1 - progress)
      })
      modelRef.current.rotation.y = 0
    } else if (t < 7) {
      // 2. Slow rotation
      const progress = (t - 3) / 4
      modelRef.current.position.x = 0
      modelRef.current.rotation.y = progress * Math.PI * 2
      arms.forEach((arm) => (arm.rotation.y = 0))
    } else {
      // 3. Resting
      modelRef.current.position.x = 0
      modelRef.current.rotation.y = 0
      modelRef.current.position.y = Math.sin(t) * 0.1
    }
  })

  return (
    <group ref={modelRef} dispose={null} scale={[8, 8, 8]} position={[8, 0, 0]}>
      <primitive object={scene} />
      {/* Local lights for the model */}
      <pointLight position={[2, 2, 2]} intensity={20} color="#ffffff" />
      <pointLight position={[-2, -2, 2]} intensity={10} color="#4ad7b0" />
    </group>
  )
}

// Preload model2
useGLTF.preload('/models/model2.glb')
