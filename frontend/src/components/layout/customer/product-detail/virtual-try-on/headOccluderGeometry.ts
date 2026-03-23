/**
 * Head Occluder Mesh
 *
 * A simplified, invisible head-shaped mesh that writes to the depth buffer
 * but NOT the color buffer.  When rendered *before* the glasses (renderOrder 0),
 * it occludes the temples so they "disappear" behind the ears and head.
 *
 * The geometry is sized relative to the normalised glasses model width
 * (TARGET_GLASSES_WIDTH = 0.14) so it can live as a direct sibling inside
 * the same group with correct proportions.
 */

import * as THREE from 'three'

/**
 * Create an occluder mesh sized for the normalised glasses coordinate system.
 *
 * The normalised glasses model is ~0.14 units wide.
 * A human head is roughly 1.4× the glasses width, slightly taller, and
 * about the same front-to-back.
 */
export function createHeadOccluder(): THREE.Mesh {
  // Start with unit sphere
  const geometry = new THREE.SphereGeometry(1, 24, 24)

  // Scale into a head-shaped ellipsoid, sized relative to glasses (0.14 wide).
  // Keep it smaller than the glasses frame so it only hides the temples
  // that go behind the ears, NOT the front frame or lenses.
  //   Head width  ≈ 0.07  (radius, so diameter ≈ 0.14)
  //   Head height ≈ 0.09  (radius, so diameter ≈ 0.18)
  //   Head depth  ≈ 0.08  (radius, so diameter ≈ 0.16)
  geometry.scale(0.07, 0.09, 0.08)

  // Push the occluder well BEHIND the lenses.
  // Negative Z = away from camera = behind the glasses front frame.
  // Larger offset ensures the front frame + lenses stay fully visible,
  // while the temples that extend into negative Z get clipped.
  geometry.translate(0, 0.005, -0.07)

  const material = new THREE.MeshBasicMaterial({
    colorWrite: false, // ← invisible (no pixel output)
    depthWrite: true, // ← writes to depth buffer
    depthTest: true,
    side: THREE.FrontSide
  })

  const mesh = new THREE.Mesh(geometry, material)
  mesh.name = 'HeadOccluder'
  mesh.renderOrder = 0 // render BEFORE glasses (renderOrder 1)

  return mesh
}
