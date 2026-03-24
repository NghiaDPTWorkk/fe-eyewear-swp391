/**
 * glassesoverlay - lớp phủ thử kính 3d chuyên nghiệp.
 *
 * kiến trúc:
 * sử dụng phương pháp lai để đạt độ tin cậy cao nhất:
 *
 *  - vị trí: dựa trên các điểm mốc (kết hợp góc mắt và sống mũi)
 *  - xoay: lấy từ ma trận biến đổi khuôn mặt của mediapipe (4x4)
 *          có chuyển đổi hệ tọa độ. dùng xoay từ điểm mốc nếu không có ma trận.
 *  - tỉ lệ: tự động điều chỉnh theo khoảng cách đồng tử thực tế.
 *  - làm mượt: bộ lọc one euro cho vị trí, xoay và tỉ lệ.
 *
 * các tính năng nâng cao:
 *  1. vật cản đầu (occluder) để che phần càng kính phía sau head
 *  2. chất liệu pbr + phản chiếu môi trường hdr trên tròng kính
 *  3. đổ bóng tiếp xúc trên sống mũi
 *  4. dọn dẹp webgl khi hủy component
 */

import { useRef, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import type { NormalizedLandmark } from '@mediapipe/tasks-vision'
import * as THREE from 'three'

import { normalizeGlassesModel, TARGET_GLASSES_WIDTH } from './glassesModelNormalizer'
import { OneEuroFilter } from './OneEuroFilter'
import { createHeadOccluder } from './headOccluderGeometry'

// props đầu vào
interface GlassesOverlayProps {
  videoRef: React.RefObject<HTMLVideoElement | null>
  landmarksRef: React.RefObject<NormalizedLandmark[][]>
  transformationMatricesRef: React.RefObject<Float32Array[]>
  glassesImageUrl: string
}

// chỉ số các điểm mốc trên khuôn mặt
const LEFT_EYE_OUTER = 33
const RIGHT_EYE_OUTER = 263
const NOSE_BRIDGE = 6

//  model
const GLB_MODEL_PATH = '/models/going.glb'

// các thông số điều chỉnh
/** tỉ lệ chiều rộng kính so với khoảng cách hai mắt */
const FACE_TO_GLASSES_RATIO = 1.7

/** trọng số các điểm neo cho vị trí (tổng phải bằng 1.0) */
const ANCHOR_W_LEFT = 0.45
const ANCHOR_W_RIGHT = 0.45
const ANCHOR_W_NOSE = 0.1

/** điều chỉnh độ lệch vị trí */
const MODEL_OFFSET_X = 0.0
const MODEL_OFFSET_Y = 0
const MODEL_OFFSET_Z = -0.2

/* độ lệch góc nghiêng (radian) - nâng hoặc hạ càng kính.
 dương = càng kính lên, âm = càng kính xuống.
 thử các giá trị từ -0.3 đến 0.3 */
const MODEL_PITCH_OFFSET = -0.07

/* trường nhìn (fov) - phải khớp với camera của canvas */
const CAMERA_FOV = 50

// cấu hình bộ lọc one euro
const OEF_CONFIG = { minCutoff: 1.7, beta: 0.01, dCutoff: 1.0 }

// component gốc
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
        <Suspense fallback={null}>
          {/* ánh sáng pbr */}
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 4, 5]} intensity={1.4} />
          <directionalLight position={[-2, -1, 3]} intensity={0.4} />

          {/* môi trường hdr để phản chiếu trên tròng kính */}
          <Environment preset="studio" />

          {/* đổ bóng tiếp xúc nhẹ trên sống mũi */}
          <ContactShadows position={[0, -0.35, 0]} opacity={0.2} scale={2} blur={2.5} far={1} />

          <GlassesScene
            videoRef={videoRef}
            landmarksRef={landmarksRef}
            transformationMatricesRef={transformationMatricesRef}
          />
        </Suspense>
      </Canvas>
    </div>
  )
}

// tải trước model
useGLTF.preload(GLB_MODEL_PATH)

// scene bên trong
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

  // bộ lọc one euro cho từng thành phần
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

  // chuẩn bị bản sao model đã được chuẩn hóa và áp dụng pbr
  const clonedScene = useMemo(() => {
    const wrapper = new THREE.Group()
    wrapper.name = 'GlassesNormalizerWrapper'
    const clone = scene.clone(true)
    wrapper.add(clone)

    normalizeGlassesModel(clone, { envMap: null })

    // đặt thứ tự hiển thị để kính vẽ sau mặt nạ che đầu
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

  // mặt nạ che đầu
  const occluderMesh = useMemo(() => createHeadOccluder(), [])

  // cập nhật bản đồ môi trường khi có sẵn
  const envPatched = useRef(false)

  // dọn dẹp khi đóng component
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

  // chuyển đổi điểm mốc chuẩn hóa sang tọa độ thế giới 3d
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

  // vòng lặp hoạt ảnh
  useFrame(({ viewport }) => {
    const group = groupRef.current
    const video = videoRef.current
    const faces = landmarksRef.current
    const matrices = transformationMatricesRef.current

    if (!group) return

    // áp bản đồ môi trường muộn
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

    // nếu không thấy mặt -> ẩn kính
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

    // hình học video và viewport
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

    // giá trị mục tiêu để lọc
    let targetX = 0,
      targetY = 0,
      targetZ = 0
    let targetSX = 1,
      targetSY = 1,
      targetSZ = 1
    const targetQuat = new THREE.Quaternion()

    // 1. tỉ lệ từ điểm mốc (khoảng cách giữa hai mắt)
    const le = toWorld(leftEye, visibleX0, visibleY0, visibleW, visibleH, vpW, vpH)
    const re = toWorld(rightEye, visibleX0, visibleY0, visibleW, visibleH, vpW, vpH)
    const nose = toWorld(noseBridge, visibleX0, visibleY0, visibleW, visibleH, vpW, vpH)

    const eyeDist = Math.sqrt((re.x - le.x) ** 2 + (re.y - le.y) ** 2 + (re.z - le.z) ** 2)
    const s = (eyeDist / TARGET_GLASSES_WIDTH) * FACE_TO_GLASSES_RATIO
    targetSX = targetSY = targetSZ = s

    // 2. xoay (ma trận hoặc dự phòng)
    if (matrices && matrices.length > 0 && matrices[0] && matrices[0].length >= 16) {
      const raw = matrices[0]
      const mpMatrix = new THREE.Matrix4()
      // dùng fromarray (column-major) để tránh bị chuyển vị
      mpMatrix.fromArray(raw)

      const _pos = new THREE.Vector3()
      const _quat = new THREE.Quaternion()
      const _scale = new THREE.Vector3()
      mpMatrix.decompose(_pos, _quat, _scale)

      // ma trận biến đổi của mediapipe đã chuẩn (y-up, z-towards),
      // nên có thể dùng trực tiếp mà không cần phủ định các trục.
      targetQuat.copy(_quat).normalize()
    } else {
      // xoay dự phòng (cải tiến thêm trục nghiêng)
      const dx = re.x - le.x
      const dy = re.y - le.y
      const dz = re.z - le.z
      const rotZ = Math.atan2(dy, dx)
      const rotY = Math.atan2(-dz, Math.sqrt(dx * dx + dy * dy)) * 0.7

      // xấp xỉ góc nghiêng: so sánh khoảng cách dọc giữa mũi và mắt
      const eyeCenterY = (le.y + re.y) / 2
      const eyeCenterZ = (le.z + re.z) / 2
      const rotX = -Math.atan2(eyeCenterZ - nose.z, eyeCenterY - nose.y) * 0.6

      targetQuat.setFromEuler(new THREE.Euler(rotX, rotY, rotZ, 'YZX'))
    }

    // 3. áp dụng độ lệch góc nghiêng (người dùng tùy chỉnh)
    const pitchQuat = new THREE.Quaternion()
    pitchQuat.setFromAxisAngle(new THREE.Vector3(1, 0, 0), MODEL_PITCH_OFFSET)
    targetQuat.multiply(pitchQuat).normalize()

    // 4. vị trí với ứng dụng độ lệch cục bộ
    // áp dụng độ lệch trong không gian cục bộ giúp kính di chuyển theo hướng mặt khi cúi/ngước.
    const anchorX = le.x * ANCHOR_W_LEFT + re.x * ANCHOR_W_RIGHT + nose.x * ANCHOR_W_NOSE
    const anchorY = le.y * ANCHOR_W_LEFT + re.y * ANCHOR_W_RIGHT + nose.y * ANCHOR_W_NOSE
    const anchorZ = le.z * ANCHOR_W_LEFT + re.z * ANCHOR_W_RIGHT + nose.z * ANCHOR_W_NOSE

    const localOffset = new THREE.Vector3(MODEL_OFFSET_X, MODEL_OFFSET_Y, MODEL_OFFSET_Z)
    localOffset.applyQuaternion(targetQuat)

    targetX = anchorX + localOffset.x
    targetY = anchorY + localOffset.y
    targetZ = anchorZ + localOffset.z

    // áp dụng bộ lọc one euro
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

    // áp dụng vào các đối tượng three.js
    group.position.set(smoothPX, smoothPY, smoothPZ)
    group.scale.set(smoothSX, smoothSY, smoothSZ)
    group.quaternion.set(smoothQX, smoothQY, smoothQZ, smoothQW)
  })

  if (!clonedScene) return null

  return (
    <group ref={groupRef} visible={false}>
      {/* mặt nạ che đầu - vẽ trước */}
      <primitive object={occluderMesh} />

      {/* kính - vẽ sau */}
      <primitive object={clonedScene} />
    </group>
  )
}
