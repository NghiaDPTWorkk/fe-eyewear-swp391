import * as THREE from 'three'

export const TARGET_GLASSES_WIDTH = 0.14

// khoảng cách đồng tử tham chiếu (ipd) tính bằng mét cho model chuẩn.
// theo landmark 468 của mediapipe: ipd trung bình của người lớn ≈ 63 mm.
export const REFERENCE_IPD_M = 0.063

export interface NormalizationOptions {
  targetWidth?: number
  autoRotate?: boolean
  /** bản đồ môi trường three.js để áp dụng cho chất liệu pbr */
  envMap?: THREE.Texture | null
}

/**
 * bộ chuẩn hóa model kính.
 *
 * 1. đảm bảo trục dài nhất là trục x (chiều rộng gọng).
 * 2. đặt tâm xoay tại trung tâm hình học.
 * 3. điều chỉnh tỉ lệ theo chiều rộng chuẩn.
 * 4. nâng cấp tất cả chất liệu sang meshstandardmaterial (pbr).
 * 5. áp dụng bản đồ môi trường để tạo phản chiếu thực tế trên tròng kính.
 */
export function normalizeGlassesModel(
  model: THREE.Object3D,
  options: NormalizationOptions = {}
): THREE.Object3D {
  const { targetWidth = TARGET_GLASSES_WIDTH, autoRotate = true, envMap = null } = options

  // ép tính toán ma trận để các phép đo chính xác
  model.updateWorldMatrix(true, true)

  // 1. đặt lại các biến đổi
  model.scale.setScalar(1)
  model.position.set(0, 0, 0)

  // 2. đo hộp bao (bounding box)
  const box = new THREE.Box3().setFromObject(model)
  const size = new THREE.Vector3()
  box.getSize(size)

  // 3. tự động xoay - đảm bảo x là trục rộng nhất
  if (autoRotate) {
    if (size.y > size.x && size.y > size.z) {
      model.rotation.z += Math.PI / 2
    }
    model.updateMatrixWorld(true)
    box.setFromObject(model)
    box.getSize(size)

    if (size.z > size.x * 1.5) {
      model.rotation.y += Math.PI / 2
    }
    model.updateMatrixWorld(true)
    box.setFromObject(model)
    box.getSize(size)
  }

  // 4. đặt tâm xoay vào giữa
  const center = new THREE.Vector3()
  box.getCenter(center)
  model.children.forEach((child) => {
    child.position.sub(center)
  })

  // 5. chuẩn hóa tỉ lệ
  const modelWidth = size.x > 0 ? size.x : 0.001
  const scaleFactor = targetWidth / modelWidth
  model.scale.setScalar(scaleFactor)
  model.updateMatrixWorld(true)

  // 6. nâng cấp chất liệu -> pbr + bản đồ môi trường
  upgradeToPBR(model, envMap)

  return model
}

// các hàm hỗ trợ chất liệu

/**
 * duyệt qua scene và chuyển đổi mọi chất liệu mesh sang meshstandardmaterial,
 * giữ nguyên màu sắc/bản đồ khuếch tán và áp dụng bản đồ môi trường.
 */
function upgradeToPBR(root: THREE.Object3D, envMap: THREE.Texture | null): void {
  root.traverse((child: THREE.Object3D) => {
    if (!(child as THREE.Mesh).isMesh) return
    const mesh = child as THREE.Mesh

    const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
    const upgraded = materials.map((mat) => convertMaterial(mat, mesh.name, envMap))

    mesh.material = upgraded.length === 1 ? upgraded[0] : upgraded
    mesh.castShadow = true
    mesh.receiveShadow = true
  })
}

function convertMaterial(
  mat: THREE.Material,
  meshName: string,
  envMap: THREE.Texture | null
): THREE.MeshStandardMaterial {
  // nếu đã là chất liệu standard hoặc physical, chỉ cần vá thêm
  if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
    if (envMap) {
      mat.envMap = envMap
      mat.envMapIntensity = isLensMesh(meshName) ? 1.2 : 0.6
    }
    mat.needsUpdate = true
    return mat as THREE.MeshStandardMaterial
  }

  // ngược lại, tạo chất liệu pbr mới
  const oldMat = mat as THREE.MeshBasicMaterial & THREE.MeshPhongMaterial
  const params: THREE.MeshStandardMaterialParameters = {
    color: oldMat.color?.clone() ?? new THREE.Color(0x333333),
    map: oldMat.map ?? null,
    transparent: oldMat.transparent ?? false,
    opacity: oldMat.opacity ?? 1,
    side: oldMat.side ?? THREE.FrontSide,
    metalness: isLensMesh(meshName) ? 0.1 : 0.4,
    roughness: isLensMesh(meshName) ? 0.05 : 0.35,
    envMap: envMap,
    envMapIntensity: isLensMesh(meshName) ? 1.2 : 0.6
  }

  const pbr = new THREE.MeshStandardMaterial(params)
  pbr.name = mat.name || meshName
  oldMat.dispose()
  return pbr
}

/**
 * nhận diện đơn giản các mesh là tròng kính dựa trên tên.
 */
function isLensMesh(name: string): boolean {
  const n = name.toLowerCase()
  return n.includes('lens') || n.includes('glass') || n.includes('lense')
}
