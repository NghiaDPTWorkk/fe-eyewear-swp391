import { useRef, useState, useMemo, useLayoutEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { Splide, SplideTrack, SplideSlide } from '@splidejs/react-splide'
import '@splidejs/react-splide/css'
import { useNavigate } from 'react-router-dom'

// ─── Types ─────────────────────────────────────────────────────────────────────
interface ShaderCarouselProps {
  imagePaths: string[]
  maskPath: string
  onLoaded?: () => void
}

// ─── Constants ─────────────────────────────────────────────────────────────────
const SLIDE_CONTENT = [
  {
    title: 'Exquisite Craft',
    description: 'Timeless design meets modern engineering.'
  },
  {
    title: 'Spring Fashion',
    description: 'A touch of elegance for every season.'
  },
  {
    title: 'Urban Vision',
    description: 'The future of premium eyewear, curated for you.'
  }
]

const SPLIDE_SPEED = 1400

// ─── Module-level cmd object (bypasses Canvas fiber boundary) ──────────────────
// Không dùng React state → không bị delay bởi batching
const cmd = {
  pending: false, // true khi có lệnh chuyển mới chưa xử lý
  from: 0,
  to: 0
}

// ─── Shaders ───────────────────────────────────────────────────────────────────
const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = `
  uniform sampler2D tex1;
  uniform sampler2D tex2;
  uniform sampler2D mask;
  uniform float progress;
  uniform float smoothing;
  varying vec2 vUv;

  void main() {
    float m     = texture2D(mask, vUv).r;
    float alpha = smoothstep(progress - smoothing, progress + smoothing, m);
    vec4 c1     = texture2D(tex1, vUv);
    vec4 c2     = texture2D(tex2, vUv);
    gl_FragColor = mix(c2, c1, alpha);
  }
`

// ─── Scene ─────────────────────────────────────────────────────────────────────
function Scene({
  speed,
  imagePaths,
  maskPath,
  onReady
}: {
  speed: number
  imagePaths: string[]
  maskPath: string
  onReady: () => void
}) {
  const matRef = useRef<THREE.ShaderMaterial>(null)
  const textures = useTexture(imagePaths)
  const mask = useTexture(maskPath)
  const running = useRef(false)

  useLayoutEffect(() => {
    ;[...textures, mask].forEach((t) => {
      t.minFilter = THREE.LinearFilter
      t.magFilter = THREE.LinearFilter
    })
    // Báo hiệu Scene đã sẵn sàng vẽ
    onReady()
  }, [textures, mask, onReady])

  const uniforms = useMemo(
    () => ({
      tex1: { value: textures[0] },
      tex2: { value: textures[0] },
      mask: { value: mask },
      progress: { value: 1.0 },
      smoothing: { value: 0.15 }
    }),
    [textures, mask]
  )

  useFrame((_, delta) => {
    if (!matRef.current) return

    // Lệnh mới đến → swap texture ngay lập tức rồi bắt đầu animation
    if (cmd.pending) {
      matRef.current.uniforms.tex1.value = textures[cmd.from]
      matRef.current.uniforms.tex2.value = textures[cmd.to]
      matRef.current.uniforms.progress.value = 0.0
      running.current = true
      cmd.pending = false // Reset ngay sau khi xử lý
    }

    // Chạy animation progress 0 → 1
    if (running.current) {
      const p = matRef.current.uniforms.progress.value
      if (p < 1.0) {
        matRef.current.uniforms.progress.value = Math.min(1.0, p + delta * (1000 / speed))
      } else {
        // Xong: cập nhật tex1 = ảnh đích để chuẩn bị transition tiếp theo
        matRef.current.uniforms.tex1.value = textures[cmd.to]
        matRef.current.uniforms.progress.value = 1.0
        running.current = false
      }
    }
  })

  return (
    <mesh scale={[1.1, 1.1, 1]}>
      <planeGeometry args={[16, 9]} />
      <shaderMaterial
        ref={matRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
      />
    </mesh>
  )
}

// ─── Main Component ─────────────────────────────────────────────────────────────
export default function ShaderCarousel({ imagePaths, maskPath, onLoaded }: ShaderCarouselProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isSceneReady, setIsSceneReady] = useState(false)
  const navigate = useNavigate()

  const handleMove = (splide: { index: number }, newIndex: number) => {
    // Ghi lệnh vào module-level object ngay lập tức — không qua React
    cmd.from = splide.index
    cmd.to = newIndex
    cmd.pending = true

    setActiveIndex(newIndex)
  }

  return (
    <div
      className={`relative w-full h-screen overflow-hidden bg-white transition-opacity duration-300 ${
        isSceneReady ? 'opacity-100' : 'opacity-0'
      }`}
    >
      {/* ── Three.js background ── */}
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 75 }} dpr={[1, 2]}>
          <Scene
            speed={SPLIDE_SPEED}
            imagePaths={imagePaths}
            maskPath={maskPath}
            onReady={() => {
              // Thêm 50ms đệm để Card đồ họa (GPU) kịp vẽ xong frame đầu tiên
              setTimeout(() => {
                setIsSceneReady(true)
                onLoaded?.()
              }, 50)
            }}
          />
        </Canvas>
      </div>

      {/* ── Splide overlay ── */}
      <Splide
        hasTrack={false}
        onMove={handleMove}
        options={{
          type: 'fade',
          rewind: true,
          autoplay: true,
          interval: 4000,
          speed: SPLIDE_SPEED,
          arrows: true,
          pagination: true,
          pauseOnHover: false,
          drag: false
        }}
        className="h-full z-10"
      >
        <SplideTrack className="h-full">
          {SLIDE_CONTENT.map((content, i) => (
            <SplideSlide key={i} className="h-full">
              <div
                className={`h-full w-full flex flex-col justify-end p-12 select-none ${i === 0 ? 'md:pb-100 md:pl-16' : 'md:p-24'}`}
              >
                <div
                  className={`transition-all duration-[500ms] ease-out ${
                    activeIndex === i
                      ? 'opacity-100 translate-y-0 blur-none'
                      : 'opacity-0 translate-y-8 blur-sm'
                  }`}
                >
                  <h2 className="text-3xl md:text-6xl font-black text-white mb-3 uppercase tracking-tight drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] pointer-events-none">
                    {content.title}
                  </h2>
                  <p className="text-base md:text-lg text-white/75 max-w-xl font-medium drop-shadow-lg mb-6 pointer-events-none">
                    {content.description}
                  </p>
                  {(i === 0 || i === 2) && (
                    <div className="flex flex-wrap gap-4">
                      <button
                        onClick={() => {
                          navigate('/eyeglasses')
                          window.scrollTo(0, 0)
                        }}
                        className="px-8 py-4 bg-primary-500/80 backdrop-blur-md text-white font-bold rounded-2xl border border-white/20 hover:bg-primary-500/100 transition-all duration-500 shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] hover:shadow-primary-500/40 transform hover:-translate-y-1 pointer-events-auto"
                      >
                        Shop Now
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </SplideSlide>
          ))}
        </SplideTrack>
      </Splide>

      {/* ── Splide custom styles ── */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
        .splide__arrow {
          background: rgba(255,255,255,0.06) !important;
          backdrop-filter: blur(20px);
          width: 4rem !important;
          height: 4rem !important;
          border: 1px solid rgba(255,255,255,0.2) !important;
          transition: all 0.4s cubic-bezier(0.16,1,0.3,1) !important;
        }
        .splide__arrow:hover {
          background: rgba(255,255,255,0.15) !important;
          transform: scale(1.1) translateY(-50%);
          border-color: rgba(255,255,255,0.4) !important;
        }
        .splide__arrow svg { fill: white !important; }
        .splide__arrow--prev { left: 2rem !important; }
        .splide__arrow--next { right: 2rem !important; }

        .splide__pagination { bottom: 2rem !important; gap: 0.75rem !important; }
        .splide__pagination__page {
          background: rgba(255,255,255,0.25) !important;
          height: 6px !important;
          width: 28px !important;
          border-radius: 3px !important;
          transition: all 0.4s ease !important;
          border: none !important;
        }
        .splide__pagination__page.is-active {
          background: white !important;
          width: 56px !important;
          box-shadow: 0 0 12px rgba(255,255,255,0.5);
        }
      `
        }}
      />
    </div>
  )
}
