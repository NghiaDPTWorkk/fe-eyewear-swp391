import { useRef, useMemo } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
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

// GLB model path (served from /public)
const GLB_MODEL_PATH = '/models/testxem.glb'

// ---- Adjust these offsets to fine-tune model placement ----
const MODEL_SCALE_FACTOR = 0.3 // overall scale relative to temple distance
const MODEL_INNER_SCALE = 0.022 // extra uniform scale for the loaded model
const MODEL_OFFSET_X = 0 // shift model left/right (negative = right on screen due to scaleX mirror)
const MODEL_OFFSET_Y = -0.1 // shift model up/down on the face (negative = down)
const MODEL_OFFSET_Z = 0 // shift model forward/backward
const DEPTH_SCALE_FACTOR = 0.4 // how much depth affects scale (0.3-0.6)
const SMOOTHING_ALPHA = 0.3 // lerp factor (0 = no movement, 1 = instant, 0.2-0.4 = smooth)

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

// Preload the GLB model so it's cached
useGLTF.preload(GLB_MODEL_PATH)

// --- GLB 3D Glasses Model ---
function GlassesModel({
  videoRef,
  landmarksRef
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  landmarksRef: React.RefObject<NormalizedLandmark[][]>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(GLB_MODEL_PATH)

  // Smoothing refs — persist previous values across frames
  const smoothPos = useRef(new THREE.Vector3())
  const smoothScale = useRef(new THREE.Vector3(1, 1, 1))
  const smoothRotZ = useRef(0)
  const smoothRotY = useRef(0)
  const isInitialized = useRef(false)

  // Clone the scene and center its geometry at origin so scaling is from the glasses center
  // Using useMemo: derived value from scene, safe to read during render
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true)

    // Compute bounding box of the entire model
    const box = new THREE.Box3().setFromObject(clone)
    const center = box.getCenter(new THREE.Vector3())

    // Shift all children so the model's center is at (0, 0, 0)
    clone.children.forEach((child) => {
      child.position.sub(center)
    })

    // Ensure glasses are depth-tested against the face occlusion mesh
    clone.traverse((child) => {
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

    // ---- Correct coordinate mapping accounting for object-cover crop ----
    // The video element uses object-cover, which crops the video to fill the
    // container while maintaining aspect ratio. MediaPipe landmarks are in
    // the full uncropped video space [0,1], so we must remap them to match
    // the visible (cropped) portion of the video on screen.

    const vw = video.videoWidth
    const vh = video.videoHeight
    const cw = video.clientWidth
    const ch = video.clientHeight

    if (!vw || !vh || !cw || !ch) {
      group.visible = false
      return
    }

    // object-cover: scale = max(cw/vw, ch/vh)
    // This tells us how much of the video is visible after cropping
    const videoAspect = vw / vh
    const containerAspect = cw / ch

    // Compute which portion of normalized [0,1] video coords is visible
    let visibleX0: number, visibleY0: number, visibleW: number, visibleH: number

    if (videoAspect > containerAspect) {
      // Video is wider than container → left/right are cropped
      visibleH = 1
      visibleW = containerAspect / videoAspect
      visibleX0 = (1 - visibleW) / 2
      visibleY0 = 0
    } else {
      // Video is taller than container → top/bottom are cropped
      visibleW = 1
      visibleH = videoAspect / containerAspect
      visibleX0 = 0
      visibleY0 = (1 - visibleH) / 2
    }

    // Three.js viewport dimensions
    const w = viewport.width
    const h = viewport.height

    // Map MediaPipe normalized landmark to Three.js world coords
    // 1. Remap from full video space to visible-crop space [0, 1]
    // 2. Then to Three.js centered coords where (0,0) is center
    const toWorld = (lm: NormalizedLandmark) => {
      const screenX = (lm.x - visibleX0) / visibleW // [0, 1] in visible area
      const screenY = (lm.y - visibleY0) / visibleH // [0, 1] in visible area
      return {
        x: (screenX - 0.5) * w,
        y: -(screenY - 0.5) * h,
        z: -lm.z * w * 0.5
      }
    }

    const nose = toWorld(noseBridge)
    const le = toWorld(leftEye)
    const re = toWorld(rightEye)
    const lt = toWorld(leftTemple)
    const rt = toWorld(rightTemple)

    // ---- Compute target values ----
    const centerX = (le.x + re.x) / 2
    const centerY = (le.y + re.y) / 2
    const targetPos = new THREE.Vector3(
      centerX + MODEL_OFFSET_X,
      centerY + MODEL_OFFSET_Y,
      nose.z + MODEL_OFFSET_Z
    )

    const templeDist = Math.sqrt((rt.x - lt.x) ** 2 + (rt.y - lt.y) ** 2 + (rt.z - lt.z) ** 2)
    // Depth-aware scaling: bigger when closer (nose.z more negative), smaller when farther
    const depthMultiplier = 1 + Math.abs(nose.z) * DEPTH_SCALE_FACTOR
    const s = templeDist * MODEL_SCALE_FACTOR * depthMultiplier
    const targetScale = new THREE.Vector3(s, s, s)

    const dx = re.x - le.x
    const dy = re.y - le.y
    const dz = re.z - le.z
    const targetRotZ = Math.atan2(dy, dx)
    const targetRotY = Math.atan2(-dz, Math.sqrt(dx * dx + dy * dy)) * 0.6

    // ---- Apply lerp smoothing ----
    const alpha = SMOOTHING_ALPHA

    if (!isInitialized.current) {
      // First frame: snap to target instantly (no lerp)
      smoothPos.current.copy(targetPos)
      smoothScale.current.copy(targetScale)
      smoothRotZ.current = targetRotZ
      smoothRotY.current = targetRotY
      isInitialized.current = true
    } else {
      // Subsequent frames: interpolate toward target
      smoothPos.current.lerp(targetPos, alpha)
      smoothScale.current.lerp(targetScale, alpha)
      smoothRotZ.current += (targetRotZ - smoothRotZ.current) * alpha
      smoothRotY.current += (targetRotY - smoothRotY.current) * alpha
    }

    group.position.copy(smoothPos.current)
    group.scale.copy(smoothScale.current)
    group.rotation.z = smoothRotZ.current
    group.rotation.y = smoothRotY.current
  })

  if (!clonedScene) return null

  return (
    <group ref={groupRef} visible={false} renderOrder={1}>
      <primitive
        object={clonedScene}
        scale={[MODEL_INNER_SCALE, MODEL_INNER_SCALE, MODEL_INNER_SCALE]}
        rotation={[0, Math.PI / 2, 0]}
      />
    </group>
  )
}
