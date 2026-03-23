/**
 * GlassesOverlay — Professional-grade 3D virtual try-on overlay.
 *
 * ── Architecture ──────────────────────────────────────────────────────
 * Uses a HYBRID approach for maximum reliability:
 *
 *  • Position:  Landmark-based (weighted blend of eye corners + nose bridge)
 *  • Rotation:  Extracted from MediaPipe's Facial Transformation Matrix (4×4)
 *               with coord-system conversion.  Falls back to landmark-derived
 *               rotation if the matrix is unavailable.
 *  • Scale:     IPD-based auto-scale from live inter-pupillary distance.
 *  • Smoothing: One Euro Filter on position (3ch), rotation (4ch quaternion),
 *               and scale (1ch) — zero jitter at rest, zero latency in motion.
 *
 * ── Pro features ──────────────────────────────────────────────────────
 *  1. Head Occluder mesh for depth-based temple occlusion
 *  2. PBR materials + HDR environment reflections on lenses
 *  3. Contact shadows on nose bridge
 *  4. Proper WebGL cleanup on unmount
 */

import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import * as THREE from 'three'

import { normalizeGlassesModel, TARGET_GLASSES_WIDTH } from './glassesModelNormalizer'
import { OneEuroFilter } from './OneEuroFilter'
import { createHeadOccluder } from './headOccluderGeometry'

// ─── Props ──────────────────────────────────────────────────────────────────────

interface GlassesOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  landmarksRef: React.RefObject<NormalizedLandmark[][]>
  transformationMatricesRef: React.RefObject<Float32Array[]>
  glassesImageUrl: string
}

// ─── Landmark indices ───────────────────────────────────────────────────────────

const LEFT_EYE_OUTER = 33
const RIGHT_EYE_OUTER = 263
const NOSE_BRIDGE = 6

// ─── GLB model ──────────────────────────────────────────────────────────────────

const GLB_MODEL_PATH = '/models/going.glb'

// ─── Tuning knobs ───────────────────────────────────────────────────────────────

/** How much wider the glasses should be relative to the eye-to-eye distance */
const FACE_TO_GLASSES_RATIO = 1.7

/** Weighted anchor for position (must sum to 1.0) */
const ANCHOR_W_LEFT = 0.45
const ANCHOR_W_RIGHT = 0.45
const ANCHOR_W_NOSE = 0.1

/** Fine-tune position offsets */
const MODEL_OFFSET_X = 0.0
const MODEL_OFFSET_Y = 0
const MODEL_OFFSET_Z = -0.2

/** Pitch offset (radians) — tilts the temples UP toward the ears.
 *  Positive = temples go UP, Negative = temples go DOWN.
 *  Try values between -0.3 and 0.3 */
const MODEL_PITCH_OFFSET = -0.07

/** Render FOV — must match the Canvas camera fov */
const CAMERA_FOV = 50

// ─── One Euro Filter config ─────────────────────────────────────────────────────

const OEF_CONFIG = { minCutoff: 1.7, beta: 0.01, dCutoff: 1.0 }

// ─── Root component ─────────────────────────────────────────────────────────────

export default function GlassesOverlay({
  videoRef,
  landmarksRef,
  transformationMatricesRef,
  glassesImageUrl: _glassesImageUrl
}: GlassesOverlayProps) {
  return (
    <div className="absolute inset-0 pointer-events-none" style={{ transform: 'scaleX(-1)' }}>
      <Canvas
        gl={{
          alpha: true,
          antialias: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
          outputColorSpace: THREE.SRGBColorSpace
        }}
        camera={{ position: [0, 0, 5], fov: CAMERA_FOV, near: 0.01, far: 100 }}
        style={{ background: 'transparent' }}
      >
        {/* PBR lighting */}
        <ambientLight intensity={0.6} />
        <directionalLight position={[3, 4, 5]} intensity={1.4} />
        <directionalLight position={[-2, -1, 3]} intensity={0.4} />

        {/* HDR environment for lens reflections */}
        <Environment preset="studio" />

        {/* Soft contact shadow on nose bridge */}
        <ContactShadows position={[0, -0.35, 0]} opacity={0.2} scale={2} blur={2.5} far={1} />

        <GlassesScene
          videoRef={videoRef}
          landmarksRef={landmarksRef}
          transformationMatricesRef={transformationMatricesRef}
        />
      </Canvas>
    </div>
  )
}

// Pre-load the model
useGLTF.preload(GLB_MODEL_PATH)

// ─── Inner scene ────────────────────────────────────────────────────────────────

function GlassesScene({
  videoRef,
  landmarksRef,
  transformationMatricesRef
}: {
  videoRef: React.RefObject<HTMLVideoElement | null>
  landmarksRef: React.RefObject<NormalizedLandmark[][]>
  transformationMatricesRef: React.RefObject<Float32Array[]>
}) {
  const groupRef = useRef<THREE.Group>(null)
  const { scene } = useGLTF(GLB_MODEL_PATH)
  const { gl } = useThree()

  // ── One Euro Filters (per-component) ──────────────────────────────────────
  const filters = useRef({
    px: new OneEuroFilter(OEF_CONFIG),
    py: new OneEuroFilter(OEF_CONFIG),
    pz: new OneEuroFilter(OEF_CONFIG),
    sx: new OneEuroFilter(OEF_CONFIG),
    sy: new OneEuroFilter(OEF_CONFIG),
    sz: new OneEuroFilter(OEF_CONFIG),
    qx: new OneEuroFilter(OEF_CONFIG),
    qy: new OneEuroFilter(OEF_CONFIG),
    qz: new OneEuroFilter(OEF_CONFIG),
    qw: new OneEuroFilter(OEF_CONFIG)
  })
  const isInitialized = useRef(false)

  // ── Prepare the normalised + PBR clone ────────────────────────────────────
  const clonedScene = useMemo(() => {
    const wrapper = new THREE.Group()
    wrapper.name = 'GlassesNormalizerWrapper'
    const clone = scene.clone(true)
    wrapper.add(clone)

    normalizeGlassesModel(clone, { envMap: null })

    // Set render order so glasses render AFTER the occluder
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

    return wrapper
  }, [scene])

  // ── Head occluder ─────────────────────────────────────────────────────────
  const occluderMesh = useMemo(() => createHeadOccluder(), [])

  // ── Patch environment map once available ──────────────────────────────────
  const envPatched = useRef(false)

  // ── Cleanup on unmount ────────────────────────────────────────────────────
  useEffect(() => {
    return () => {
      clonedScene.traverse((child: THREE.Object3D) => {
        if ((child as THREE.Mesh).isMesh) {
          const mesh = child as THREE.Mesh
          mesh.geometry?.dispose()
          const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
          mats.forEach((m) => m?.dispose())
        }
      })
      occluderMesh.geometry?.dispose()
      ;(occluderMesh.material as THREE.Material)?.dispose()
    }
  }, [clonedScene, occluderMesh])

  // ── Helper: normalised landmark → world coords ────────────────────────────
  const toWorld = (
    lm: NormalizedLandmark,
    visibleX0: number,
    visibleY0: number,
    visibleW: number,
    visibleH: number,
    vpW: number,
    vpH: number
  ) => {
    const sx = (lm.x - visibleX0) / visibleW
    const sy = (lm.y - visibleY0) / visibleH
    return {
      x: (sx - 0.5) * vpW,
      y: -(sy - 0.5) * vpH,
      z: -lm.z * vpW * 1.0
    }
  }

  // ── Animation loop ────────────────────────────────────────────────────────
  useFrame(({ viewport }) => {
    const group = groupRef.current
    const video = videoRef.current
    const faces = landmarksRef.current
    const matrices = transformationMatricesRef.current

    if (!group) return

    // Lazily patch environment map
    if (!envPatched.current && gl) {
      const envMap = (gl as any).__r3f?.scene?.environment as THREE.Texture | undefined
      if (envMap) {
        clonedScene.traverse((child: THREE.Object3D) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            mats.forEach((m) => {
              if (m instanceof THREE.MeshStandardMaterial) {
                m.envMap = envMap
                m.envMapIntensity = m.name.toLowerCase().includes('lens') ? 1.2 : 0.6
                m.needsUpdate = true
              }
            })
          }
        })
        envPatched.current = true
      }
    }

    // ── No face → hide ──────────────────────────────────────────────────────
    if (!faces || faces.length === 0 || !video) {
      group.visible = false
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

    // ── Video ↔ viewport geometry ───────────────────────────────────────────
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

    const vpW = viewport.width
    const vpH = viewport.height

    // ── Target values to be filtered ────────────────────────────────────────
    let targetX = 0,
      targetY = 0,
      targetZ = 0
    let targetSX = 1,
      targetSY = 1,
      targetSZ = 1
    const targetQuat = new THREE.Quaternion()

    // ── 1. Scale from Landmarks (Inter-pupillary distance) ──────────────────
    const le = toWorld(leftEye, visibleX0, visibleY0, visibleW, visibleH, vpW, vpH)
    const re = toWorld(rightEye, visibleX0, visibleY0, visibleW, visibleH, vpW, vpH)
    const nose = toWorld(noseBridge, visibleX0, visibleY0, visibleW, visibleH, vpW, vpH)

    const eyeDist = Math.sqrt((re.x - le.x) ** 2 + (re.y - le.y) ** 2 + (re.z - le.z) ** 2)
    const s = (eyeDist / TARGET_GLASSES_WIDTH) * FACE_TO_GLASSES_RATIO
    targetSX = targetSY = targetSZ = s

    // ── 2. Rotation (Matrix or Fallback) ────────────────────────────────────
    if (matrices && matrices.length > 0 && matrices[0] && matrices[0].length >= 16) {
      const raw = matrices[0]
      const mpMatrix = new THREE.Matrix4()
      // Use fromArray (column-major) instead of .set (row-major) to avoid transposition
      mpMatrix.fromArray(raw)

      const _pos = new THREE.Vector3()
      const _quat = new THREE.Quaternion()
      const _scale = new THREE.Vector3()
      mpMatrix.decompose(_pos, _quat, _scale)

      // MediaPipe's Facial Transformation Matrix is already canonical (Y-up, Z-towards),
      // so we can use the decomposed quaternion directly without negations now
      // that we've fixed the matrix loading (use fromArray instead of .set).
      targetQuat.copy(_quat).normalize()
    } else {
      // Fallback Rotation (Improved with Pitch)
      const dx = re.x - le.x
      const dy = re.y - le.y
      const dz = re.z - le.z
      const rotZ = Math.atan2(dy, dx)
      const rotY = Math.atan2(-dz, Math.sqrt(dx * dx + dy * dy)) * 0.7

      // Basic pitch approximation:
      // Head UP => nose.z increases, eyes.z decreases => eye.z - nose.z is negative.
      // We want a positive X rotation for tilting UP in Three.js.
      const eyeCenterY = (le.y + re.y) / 2
      const eyeCenterZ = (le.z + re.z) / 2
      const rotX = -Math.atan2(eyeCenterZ - nose.z, eyeCenterY - nose.y) * 0.6

      targetQuat.setFromEuler(new THREE.Euler(rotX, rotY, rotZ, 'YZX'))
    }

    // ── 3. Apply pitch offset (User tunable) ────────────────────────────────
    const pitchQuat = new THREE.Quaternion()
    pitchQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), MODEL_PITCH_OFFSET)
    targetQuat.multiply(pitchQuat).normalize()

    // ── 4. Position with LOCAL Offset Application ───────────────────────────
    // This is the CRITICAL fix: applying MODEL_OFFSET in local space
    // ensures it follows the face's normal as the head tilts.
    const anchorX = le.x * ANCHOR_W_LEFT + re.x * ANCHOR_W_RIGHT + nose.x * ANCHOR_W_NOSE
    const anchorY = le.y * ANCHOR_W_LEFT + re.y * ANCHOR_W_RIGHT + nose.y * ANCHOR_W_NOSE
    const anchorZ = le.z * ANCHOR_W_LEFT + re.z * ANCHOR_W_RIGHT + nose.z * ANCHOR_W_NOSE

    const localOffset = new THREE.Vector3(MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z)
    localOffset.applyQuaternion(targetQuat)

    targetX = anchorX + localOffset.x
    targetY = anchorY + localOffset.y
    targetZ = anchorZ + localOffset.z

    // ── Apply One Euro Filter ───────────────────────────────────────────────
    const t = performance.now() / 1000
    const f = filters.current

    let smoothPX: number, smoothPY: number, smoothPZ: number
    let smoothSX: number, smoothSY: number, smoothSZ: number
    let smoothQX: number, smoothQY: number, smoothQZ: number, smoothQW: number

    if (!isInitialized.current) {
      smoothPX = targetX
      smoothPY = targetY
      smoothPZ = targetZ
      smoothSX = targetSX
      smoothSY = targetSY
      smoothSZ = targetSZ
      smoothQX = targetQuat.x
      smoothQY = targetQuat.y
      smoothQZ = targetQuat.z
      smoothQW = targetQuat.w
      f.px.filter(targetX, t)
      f.py.filter(targetY, t)
      f.pz.filter(targetZ, t)
      f.sx.filter(targetSX, t)
      f.sy.filter(targetSY, t)
      f.sz.filter(targetSZ, t)
      f.qx.filter(targetQuat.x, t)
      f.qy.filter(targetQuat.y, t)
      f.qz.filter(targetQuat.z, t)
      f.qw.filter(targetQuat.w, t)
      isInitialized.current = true
    } else {
      smoothPX = f.px.filter(targetX, t)
      smoothPY = f.py.filter(targetY, t)
      smoothPZ = f.pz.filter(targetZ, t)
      smoothSX = f.sx.filter(targetSX, t)
      smoothSY = f.sy.filter(targetSY, t)
      smoothSZ = f.sz.filter(targetSZ, t)
      const fx = f.qx.filter(targetQuat.x, t)
      const fy = f.qy.filter(targetQuat.y, t)
      const fz = f.qz.filter(targetQuat.z, t)
      const fw = f.qw.filter(targetQuat.w, t)
      const sq = new THREE.Quaternion(fx, fy, fz, fw).normalize()
      smoothQX = sq.x
      smoothQY = sq.y
      smoothQZ = sq.z
      smoothQW = sq.w
    }

    // ── Apply to Three.js objects ──────────────────────────────────────────
    group.position.set(smoothPX, smoothPY, smoothPZ)
    group.scale.set(smoothSX, smoothSY, smoothSZ)
    group.quaternion.set(smoothQX, smoothQY, smoothQZ, smoothQW)
  })

  if (!clonedScene) return null

  return (
    <group ref={groupRef} visible={false}>
      {/* Head occluder — child of group, rendered first (renderOrder 0) */}
      <primitive object={occluderMesh} />

      {/* Glasses — rendered second (renderOrder 1) */}
      <primitive object={clonedScene} />
    </group>
  )
}
