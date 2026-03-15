import { useRef, useMemo } from 'react'
import { Canvas, useFrame, type RootState } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import * as THREE from 'three'

interface GlassesOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  landmarksRef: React.RefObject<NormalizedLandmark[][]>
  transformationMatricesRef: React.RefObject<Float32Array[]>
  glassesImageUrl: string
}

const LEFT_EYE_OUTER = 33
const RIGHT_EYE_OUTER = 263
const NOSE_BRIDGE = 6

const GLB_MODEL_PATH = '/models/sunglass.glb'

const MODEL_SCALE_FACTOR = 1.15
const MODEL_INNER_SCALE = 5
const MODEL_DEPTH_SCALE = 2.3
const MODEL_OFFSET_X = 0.05
const MODEL_OFFSET_Y = -0.3
const MODEL_OFFSET_Z = -6
const SMOOTHING_ALPHA = 0.2

export default function GlassesOverlay({
  videoRef,
  landmarksRef,
  transformationMatricesRef,
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
        <GlassesModel
          videoRef={videoRef}
          landmarksRef={landmarksRef}
          transformationMatricesRef={transformationMatricesRef}
        />
      </Canvas>
    </div>
  )
}

useGLTF.preload(GLB_MODEL_PATH)

function GlassesModel({
  videoRef,
  landmarksRef,
  transformationMatricesRef
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  landmarksRef: React.RefObject<NormalizedLandmark[][]>
  transformationMatricesRef: React.RefObject<any[]>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(GLB_MODEL_PATH)

  const smoothPos = useRef(new THREE.Vector3())
  const smoothScale = useRef(new THREE.Vector3(1, 1, 1))
  const smoothRotZ = useRef(0)
  const smoothRotY = useRef(0)
  const isInitialized = useRef(false)

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)
    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())
    clone.children.forEach((child: THREE.Object3D) => {
      child.position.sub(center)
    })
    clone.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh
        mesh.renderOrder = 1
        if (mesh.material) {
          const mat = mesh.material as THREE.Material
          mat.depthTest = true
          mat.depthWrite = true
        }
      }
    })
    return clone
  }, [scene])

  useFrame(({ viewport }: RootState) => {
    const group = groupRef.current
    const faces = landmarksRef.current
    const video = videoRef.current

    if (!group || !faces || faces.length === 0 || !video) {
      if (group) group.visible = false
      return
    }

    const face = faces[0]
    const leftEye = face[LEFT_EYE_OUTER]
    const rightEye = face[RIGHT_EYE_OUTER]
    const noseBridge = face[NOSE_BRIDGE]

    if (!leftEye || !rightEye || !noseBridge) {
      group.visible = false
      return
    }

    group.visible = true

    const vw = video.videoWidth
    const vh = video.videoHeight
    const cw = video.clientWidth
    const ch = video.clientHeight

    if (!vw || !vh || !cw || !ch) return

    const videoAspect = vw / vh
    const containerAspect = cw / ch
    let visibleX0 = 0,
      visibleY0 = 0,
      visibleW = 1,
      visibleH = 1

    if (videoAspect > containerAspect) {
      visibleW = containerAspect / videoAspect
      visibleX0 = (1 - visibleW) / 2
    } else {
      visibleH = videoAspect / containerAspect
      visibleY0 = (1 - visibleH) / 2
    }

    const w = viewport.width
    const h = viewport.height

    const toWorld = (lm: NormalizedLandmark) => {
      const screenX = (lm.x - visibleX0) / visibleW
      const screenY = (lm.y - visibleY0) / visibleH
      return {
        x: (screenX - 0.5) * w,
        y: -(screenY - 0.5) * h,
        z: -lm.z * w * 1.0
      }
    }

    const nose = toWorld(noseBridge)
    const le = toWorld(leftEye)
    const re = toWorld(rightEye)

    const centerX = (le.x + re.x) / 2
    const centerY = (le.y + re.y) / 2

    const targetPos = new THREE.Vector3(
      centerX + MODEL_OFFSET_X,
      centerY + MODEL_OFFSET_Y,
      nose.z + MODEL_OFFSET_Z
    )

    const baseDist = Math.sqrt((re.x - le.x) ** 2 + (re.y - le.y) ** 2 + (re.z - le.z) ** 2)
    const s = baseDist * 2.6 * MODEL_SCALE_FACTOR
    const targetScale = new THREE.Vector3(s, s, s * MODEL_DEPTH_SCALE)

    const dx = re.x - le.x
    const dy = re.y - le.y
    const dz = re.z - le.z
    const targetRotZ = Math.atan2(dy, dx)
    const targetRotY = Math.atan2(-dz, Math.sqrt(dx * dx + dy * dy)) * 0.7

    const alpha = SMOOTHING_ALPHA
    if (!isInitialized.current) {
      smoothPos.current.copy(targetPos)
      smoothScale.current.copy(targetScale)
      smoothRotZ.current = targetRotZ
      smoothRotY.current = targetRotY
      isInitialized.current = true
    } else {
      smoothPos.current.lerp(targetPos, alpha)
      smoothScale.current.lerp(targetScale, alpha)
      smoothRotZ.current += (targetRotZ - smoothRotZ.current) * alpha
      smoothRotY.current += (targetRotY - smoothRotY.current) * alpha
    }

    group.position.copy(smoothPos.current)
    group.scale.copy(smoothScale.current)
    group.rotation.z = smoothRotZ.current
    group.rotation.y = smoothRotY.current

    if (transformationMatricesRef.current.length > 0) {
      void transformationMatricesRef.current.length
    }
  })

  if (!clonedScene) return null

  return (
    <group ref={groupRef} visible={false} renderOrder={1}>
      <primitive
        object={clonedScene}
        scale={[MODEL_INNER_SCALE, MODEL_INNER_SCALE, MODEL_INNER_SCALE]}
        rotation={[0.05, 0, 0]}
      />
    </group>
  )
}
