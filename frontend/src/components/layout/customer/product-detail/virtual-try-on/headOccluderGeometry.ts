/*
 mặt nạ che đầu
 *
 một mesh hình đầu đơn giản, vô hình chỉ ghi vào bộ đệm độ sâu (depth buffer)
 mà không ghi vào bộ đệm màu (color buffer). khi được vẽ trước kính (renderorder 0),   nó sẽ che đi phần càng kính để chúng "biến mất" sau tai và đầu.
 *
  kích thước hình học được tính tỉ lệ với chiều rộng kính chuẩn (0.14)
  để có tỉ lệ chính xác khi nằm chung trong một nhóm.
 */

import * as THREE from 'three'

/**
  tạo mesh mặt nạ che đầu theo hệ tọa độ kính chuẩn.
 *
  model kính chuẩn rộng khoảng 0.14 đơn vị.
 đầu người rộng khoảng 1.4 lần chiều rộng kính, cao hơn một chút
 và có độ sâu tương đương.
 */
export function createHeadOccluder(): THREE.Mesh {
  // bắt đầu với hình cầu đơn vị
  const geometry = new THREE.SphereGeometry(1, 24, 24)

  // co giãn thành hình elip dạng đầu, tỉ lệ theo kính.
  // giữ nó nhỏ hơn gọng kính để chỉ che phần càng kính sau tai,
  // không che phần khung trước hoặc tròng kính.
  //   rộng ≈ 0.07 (bán kính)
  //   cao ≈ 0.09 (bán kính)
  //   sâu ≈ 0.08 (bán kính)
  geometry.scale(0.07, 0.09, 0.08)

  // đẩy mặt nạ ra phía sau tròng kính.
  // z âm = xa camera hơn = nằm sau khung kính trước.
  // khoảng cách này đảm bảo khung trước và tròng kính luôn hiển thị,
  // trong khi càng kính kéo dài ra phía sau sẽ bị che đi.
  geometry.translate(0, 0.005, -0.07)

  const material = new THREE.MeshBasicMaterial({
    colorWrite: false, // vô hình (không xuất điểm ảnh)
    depthWrite: true, // ghi vào bộ đệm độ sâu
    depthTest: true,
    side: THREE.FrontSide
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'HeadOccluder'
  mesh.renderOrder = 0 // vẽ trước kính (renderorder 1)

  return mesh
}
