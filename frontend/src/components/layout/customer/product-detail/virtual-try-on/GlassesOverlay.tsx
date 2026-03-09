import { useRef, useMemo } from 'react'
import { Canvas, useFrame, type ThreeElements, type RootState } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import * as THREE from 'three'
import { normalizeGlassesModel, TARGET_GLASSES_WIDTH } from './glassesModelNormalizer'

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace React {
    // eslint-disable-next-line @typescript-eslint/no-namespace
    namespace JSX {
      // eslint-disable-next-line @typescript-eslint/no-empty-object-type
      interface IntrinsicElements extends ThreeElements {}
    }
  }
}

interface GlassesOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  landmarksRef: React.RefObject<NormalizedLandmark[][]>
  transformationMatricesRef: React.RefObject<Float32Array[]>
  glassesImageUrl: string
}

// Key landmark indices
const LEFT_EYE_OUTER = 33
const RIGHT_EYE_OUTER = 263
const NOSE_BRIDGE = 6

// GLB model path (served from /public)
const GLB_MODEL_PATH = '/models/sunglass.glb'

// ---- Adjust these offsets to fine-tune model placement ----
//
// ── Auto-fit scale ───────────────────────────────────────────────────────────
// groupScale = (faceWidth / TARGET_GLASSES_WIDTH) * FACE_TO_GLASSES_RATIO
//   faceWidth            – live outer-eye distance in Three.js world units
//   TARGET_GLASSES_WIDTH – canonical model width from normalizeGlassesModel (0.14)
//   FACE_TO_GLASSES_RATIO – single size trim knob (raise → wider, lower → narrower)
const FACE_TO_GLASSES_RATIO = 2.5
const MODEL_DEPTH_SCALE = 2.3 // Z-axis stretch so temples reach the ears

// ── Nose-bridge anchor weights ───────────────────────────────────────────────
// The group pivot is a weighted blend of the three tracking landmarks.
// Adding a small nose weight pulls the glasses onto the nose bridge so that
// models with off-centre pivots sit naturally rather than floating mid-face.
// Weights must sum to 1.0.
const ANCHOR_W_LEFT = 0.45 // weight for left-eye outer corner
const ANCHOR_W_RIGHT = 0.45 // weight for right-eye outer corner
const ANCHOR_W_NOSE = 0.1 // weight for nose-bridge  (bias toward nose bridge)

// ── Fine-tune offsets (applied after the weighted anchor) ────────────────────
const MODEL_OFFSET_X = 0.05 // nudge left/right if the model is asymmetric
const MODEL_OFFSET_Y = -0.3 // nudge up/down  (negative = down toward nose)
const MODEL_OFFSET_Z = -5 // Chỉnh lại (Z) để kính nằm ngay sống mũi (trước đó là -6)
const SMOOTHING_ALPHA = 0.2 // lerp factor – smaller = smoother but laggier
const YAW_THRESHOLD = 0.1 // radians – sensitivity for hiding side temples

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
    // Tạo một group cha để bao bọc scene gốc
    // Điều này giúp cô lập logic "recentre" và "orient" của normalizer
    const wrapper = new THREE.Group()
    wrapper.name = 'GlassesNormalizerWrapper'
    const clone = scene.clone(true)
    wrapper.add(clone)

    // Chuẩn hóa pivot, orientation và scale cho model bên trong wrapper
    // Hàm này sẽ tự động phát hiện trục dài nhất để làm chiều rộng (X)
    normalizeGlassesModel(clone)

    wrapper.traverse((child: THREE.Object3D) => {
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

    return wrapper // Trả về Wrapper đã chứa model đã chuẩn hóa
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

    // ── Weighted anchor: blend left-eye, right-eye, and nose-bridge ─────────
    // Using a small nose weight (ANCHOR_W_NOSE = 0.10) biases the pivot toward
    // the nose so the glasses sit naturally on the face even when a model's
    // internal pivot is off-centre.  Adjust the weights at the top of the file
    // if you want more or less nose-bridge bias.
    const anchorX = le.x * ANCHOR_W_LEFT + re.x * ANCHOR_W_RIGHT + nose.x * ANCHOR_W_NOSE
    const anchorY = le.y * ANCHOR_W_LEFT + re.y * ANCHOR_W_RIGHT + nose.y * ANCHOR_W_NOSE
    const anchorZ = le.z * ANCHOR_W_LEFT + re.z * ANCHOR_W_RIGHT + nose.z * ANCHOR_W_NOSE

    const targetPos = new THREE.Vector3(
      anchorX + MODEL_OFFSET_X,
      anchorY + MODEL_OFFSET_Y,
      anchorZ + MODEL_OFFSET_Z
    )

    // ── Auto-fit: map the live face width onto the normalised model width ──────
    // Every model has been normalised to TARGET_GLASSES_WIDTH by normalizeGlassesModel.
    // Scaling the group by (faceWidth / TARGET_GLASSES_WIDTH) makes the glasses
    // span exactly the user's inter-eye distance, regardless of the GLB source.
    const faceWidth = Math.sqrt((re.x - le.x) ** 2 + (re.y - le.y) ** 2 + (re.z - le.z) ** 2)
    const s = (faceWidth / TARGET_GLASSES_WIDTH) * FACE_TO_GLASSES_RATIO
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

    // ── Temple Visibility: Hide far-side temples to simulate occlusion ──────
    // When the head turns, the "far" temple is naturally hidden by the face.
    // Logic:
    //  • if yaw > threshold   → hide left temple
    //  • if yaw < -threshold  → hide right temple
    group.traverse((child: THREE.Object3D) => {
      if (child.name === 'TempleLeft') {
        child.visible = smoothRotY.current < YAW_THRESHOLD
      } else if (child.name === 'TempleRight') {
        child.visible = smoothRotY.current > -YAW_THRESHOLD
      } else if (child.name === 'FrontFrame') {
        child.visible = true // Always visible
      }
    })

    // Suppress warning
    if (transformationMatricesRef.current.length > 0) {
      /* placeholder */
    }
  })

  if (!clonedScene) return null

  return (
    <group ref={groupRef} visible={false} renderOrder={1}>
      <primitive object={clonedScene} scale={[1, 1, 1]} rotation={[0.05, 0, 0]} />
    </group>
  )
}
