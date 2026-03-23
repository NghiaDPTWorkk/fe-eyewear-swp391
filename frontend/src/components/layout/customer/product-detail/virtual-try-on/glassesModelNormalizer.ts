import * as THREE from 'three'

export const TARGET_GLASSES_WIDTH = 0.14

// Reference IPD (interpupillary distance) in metres for the canonical model.
// MediaPipe landmark 468-style: average adult IPD ≈ 63 mm.
export const REFERENCE_IPD_M = 0.063

export interface NormalizationOptions {
  targetWidth?: number
  autoRotate?: boolean
  /** Three.js environment map to apply to PBR materials */
  envMap?: THREE.Texture | null
}

/**
 * Robust glasses-model normaliser.
 *
 * 1. Ensures the longest axis is X (frame width).
 * 2. Centres the pivot at the geometric centre.
 * 3. Scales to a canonical width.
 * 4. Upgrades all materials to MeshStandardMaterial (PBR).
 * 5. Applies an environment map for realistic reflections on lenses.
 */
export function normalizeGlassesModel(
  model: THREE.Object3D,
  options: NormalizationOptions = {}
): THREE.Object3D {
  const { targetWidth = TARGET_GLASSES_WIDTH, autoRotate = true, envMap = null } = options

  // Force matrix computation so measurements are accurate
  model.updateWorldMatrix(true, true)

  // 1. Reset transforms
  model.scale.setScalar(1)
  model.position.set(0, 0, 0)

  // 2. Measure bounding box
  const box = new THREE.Box3().setFromObject(model)
  const size = new THREE.Vector3()
  box.getSize(size)

  // 3. Auto-rotate — ensure X is the widest axis
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

  // 4. Centre pivot
  const center = new THREE.Vector3()
  box.getCenter(center)
  model.children.forEach((child) => {
    child.position.sub(center)
  })

  // 5. Normalise scale
  const modelWidth = size.x > 0 ? size.x : 0.001
  const scaleFactor = targetWidth / modelWidth
  model.scale.setScalar(scaleFactor)
  model.updateMatrixWorld(true)

  // 6. Upgrade materials → PBR + environment map
  upgradeToPBR(model, envMap)

  return model
}

// ─── Material helpers ───────────────────────────────────────────────────────────

/**
 * Walk the scene and convert every mesh material to MeshStandardMaterial,
 * preserving diffuse colour / maps, and applying the given environment map.
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
  // If already a Standard or Physical material, just patch it
  if (mat instanceof THREE.MeshStandardMaterial || mat instanceof THREE.MeshPhysicalMaterial) {
    if (envMap) {
      mat.envMap = envMap
      mat.envMapIntensity = isLensMesh(meshName) ? 1.2 : 0.6
    }
    mat.needsUpdate = true
    return mat as THREE.MeshStandardMaterial
  }

  // Otherwise, create a fresh PBR material
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
 * Very simple heuristic to detect lens meshes — adjust if your models
 * use different naming conventions.
 */
function isLensMesh(name: string): boolean {
  const n = name.toLowerCase()
  return n.includes('lens') || n.includes('glass') || n.includes('lense')
}
