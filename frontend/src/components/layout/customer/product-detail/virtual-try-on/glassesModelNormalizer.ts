import * as THREE from 'three'

export const TARGET_GLASSES_WIDTH = 0.14

export interface NormalizationOptions {
  targetWidth?: number
  autoRotate?: boolean
}

/**
 * Chuẩn hóa model kính một cách mạnh mẽ (Robust Normalization)
 * 1. Đảm bảo trục dài nhất là trục X (chiều rộng kính)
 * 2. Đưa tâm hình học về (0,0,0)
 * 3. Scale về kích thước chuẩn
 */
export function normalizeGlassesModel(
  model: THREE.Object3D,
  options: NormalizationOptions = {}
): THREE.Object3D {
  const { targetWidth = TARGET_GLASSES_WIDTH, autoRotate = true } = options

  // Ép tính toán ma trận để đo đạc được ngay
  model.updateWorldMatrix(true, true)

  // 1. Reset về trạng thái sạch để đo đạc chính xác
  model.scale.setScalar(1)
  model.position.set(0, 0, 0)

  // 2. Đo kích thước thực tế
  const box = new THREE.Box3().setFromObject(model)
  const size = new THREE.Vector3()
  box.getSize(size)

  // 3. Tự động xoay để đảm bảo kính nằm ngang (X là chiều rộng)
  if (autoRotate) {
    // TRƯỜNG HỢP 1: Kính bị dựng đứng (Y là trục lớn nhất)
    if (size.y > size.x && size.y > size.z) {
      model.rotation.z += Math.PI / 2
    }

    model.updateMatrixWorld(true)
    box.setFromObject(model)
    box.getSize(size)

    // TRƯỜNG HỢP 2: Kính bị quay ngang (Z lớn hơn X quá nhiều)
    // Lưu ý: Kính có càng mở thì Z thường lớn hơn X một chút (~1.1 lần)
    // Ta chỉ xoay nếu Z > X * 1.5 (dấu hiệu chắc chắn bị sai hướng)
    if (size.z > size.x * 1.5) {
      model.rotation.y += Math.PI / 2
    }

    model.updateMatrixWorld(true)
    box.setFromObject(model)
    box.getSize(size)
  }

  // 4. Chuẩn hóa Pivot (Tâm)
  const center = new THREE.Vector3()
  box.getCenter(center)

  // Cách dịch chuyển pivot an toàn nhất:
  // Dịch chuyển TẤT CẢ các con trực tiếp của model ngược lại -center
  model.children.forEach((child) => {
    child.position.sub(center)
  })

  // 4. Chuẩn hóa Scale
  const modelWidth = size.x > 0 ? size.x : 0.001
  const scaleFactor = targetWidth / modelWidth

  model.scale.setScalar(scaleFactor)
  model.updateMatrixWorld(true)

  console.log(`[Normalizer] ${model.name || 'Model'} normalized:
    - Original Width: ${modelWidth.toFixed(4)}
    - Applied Scale: ${scaleFactor.toFixed(6)}
    - Target Width: ${targetWidth}
  `)

  return model
}
