import { useMemo, useRef } from 'react'

import { useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'

import * as THREE from 'three'

export const Eyewear3D = () => {
  const modelRef = useRef<THREE.Group>(null)

  // Use model1 for higher detail and realistic sharpness
  const { scene } = useGLTF('/models/model1.glb')

  // Material setup (Fade Style: Crystal Clear & High Contrast)
  useMemo(() => {
    if (!scene) return

    // Normalize and center
    const box = new THREE.Box3().setFromObject(scene)
    const center = box.getCenter(new THREE.Vector3())
    scene.position.sub(center)

    scene.traverse((child) => {
      if (child instanceof THREE.Mesh) {
        const name = child.name.toLowerCase()

        // Polished Ceramic / White Gold Frame
        if (name.includes('frame') || name.includes('metal') || name.includes('body')) {
          child.material = new THREE.MeshStandardMaterial({
            color: '#f8f8f8',
            metalness: 0.95,
            roughness: 0.05,
            envMapIntensity: 2
          })
        }

        // High-Tech Emerald Glass Lenses
        if (name.includes('lens') || name.includes('glass')) {
          child.material = new THREE.MeshPhysicalMaterial({
            color: '#0a3026',
            metalness: 0.1,
            roughness: 0,
            transmission: 0.9,
            thickness: 1,
            clearcoat: 1,
            clearcoatRoughness: 0,
            transparent: true,
            opacity: 0.85,
            envMapIntensity: 4
          })
        }
      }
    })
  }, [scene])

  // High-End Cinematic Animation (Sequence Fixed by User Feedback)
  useFrame((state) => {
    const t = state.clock.getElapsedTime()
    if (!modelRef.current) return

    // Note: Orientation logic is carefully calculated to ensure Lenses face user during Zoom

    if (t < 2.5) {
      // 1. Entrance (0s - 2.5s): Fly in from Top-Right Corner + Rotate 360 degrees
      const progress = t / 2.5
      const eased = 1 - Math.pow(1 - progress, 3)
      modelRef.current.position.x = 6 * (1 - eased)
      modelRef.current.position.y = 2 * (1 - eased)
      modelRef.current.position.z = 0
      modelRef.current.scale.setScalar(eased * 0.45)

      // Full 360 Turn (Math.PI * 2)
      modelRef.current.rotation.y = eased * Math.PI * 2
    } else if (t < 4.5) {
      // 2. Rotate Half a Turn More (2.5s - 4.5s)
      const progress = (t - 2.5) / 2.0
      // 360 (2PI) + 180 (PI) = 540 (3PI). Correct for front-facing.
      modelRef.current.rotation.y = Math.PI * 2 + progress * Math.PI
      modelRef.current.scale.setScalar(0.45)
      modelRef.current.position.set(0, 0, 0)
    } else if (t < 7.0) {
      // 3. ZOOM WEAR PHASE (4.5s - 7.0s): Massive push to screen
      const progress = (t - 4.5) / 2.5
      const zoomEased = Math.pow(progress, 3)

      // Face front (Locked at 3*PI)
      modelRef.current.rotation.y = Math.PI * 3
      modelRef.current.scale.setScalar(0.45 + zoomEased * 10)
      modelRef.current.position.z = zoomEased * 12
      modelRef.current.position.y = zoomEased * -0.3
    } else if (t < 9.5) {
      // 4. Shrink Back to center (7.0s - 9.5s)
      const progress = (t - 7.0) / 2.5
      const returnEased = 1 - Math.pow(1 - progress, 3)
      modelRef.current.scale.setScalar(10.45 - returnEased * 10)
      modelRef.current.position.z = 12 * (1 - returnEased)
      modelRef.current.position.y = -0.3 * (1 - returnEased)
      modelRef.current.rotation.y = Math.PI * 3 // Stay front while receding
    } else if (t < 11.5) {
      // 5. Rotate Half a Turn More (9.5s - 11.5s)
      const progress = (t - 9.5) / 2.0
      // 3PI + PI = 4PI
      modelRef.current.rotation.y = Math.PI * 3 + progress * Math.PI
    } else {
      // 6. Resting State (11.5s+)
      modelRef.current.position.z = 0
      modelRef.current.scale.setScalar(0.45 + Math.sin(t) * 0.01)
      modelRef.current.position.y = Math.sin(t / 2) * 0.05
      modelRef.current.rotation.y = Math.PI * 4 + Math.sin(t / 4) * 0.1
    }
  })

  return (
    <group ref={modelRef} dispose={null} scale={[0.1, 0.1, 0.1]} position={[8, 2, 0]}>
      <primitive object={scene} />

      {/* Precision White Studio Projection */}
      <spotLight
        position={[0, 5, 0]}
        intensity={120}
        angle={0.25}
        penumbra={1}
        color="#ffffff"
        castShadow
      />
      <pointLight position={[3, 2, 2]} intensity={60} color="#ffffff" />
      <pointLight position={[-3, -2, 2]} intensity={30} color="#4ad7b0" />
    </group>
  )
}

// Preload model1
useGLTF.preload('/models/model1.glb')
