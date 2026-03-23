import { useCallback, useRef, useState } from 'react'
import { FaceLandmarker, FilesetResolver, type NormalizedLandmark } from '@mediapipe/tasks-vision'

const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
const MODEL_CDN =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

/**
 * tốc độ lấy mẫu mục tiêu.
 * giới hạn ở ~30 fps để không làm quá tải gpu khi three.js đang chạy vòng lặp render.
 */
const TARGET_FPS = 30
const FRAME_INTERVAL_MS = 1000 / TARGET_FPS

export function useFaceLandmarker() {
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isModelReady, setIsModelReady] = useState(false)
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const animFrameRef = useRef<number>(0)
  const landmarksRef = useRef<NormalizedLandmark[][]>([])
  const transformationMatricesRef = useRef<Float32Array[]>([])

  const initModel = useCallback(async () => {
    if (landmarkerRef.current) {
      setIsModelReady(true)
      return
    }

    setIsModelLoading(true)
    try {
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN)
      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_CDN,
          delegate: 'GPU'
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: false,
        // bật trích xuất ma trận biến đổi khuôn mặt 4x4
        outputFacialTransformationMatrixes: true
      })
      landmarkerRef.current = faceLandmarker
      setIsModelReady(true)
    } catch (err) {
      console.error('lỗi khởi tạo facelandmarker:', err)
      throw err
    } finally {
      setIsModelLoading(false)
    }
  }, [])

  const startDetection = useCallback((video: HTMLVideoElement) => {
    const landmarker = landmarkerRef.current
    if (!landmarker) return

    let lastTime = -1
    let lastDetectTime = 0

    const detect = () => {
      const now = performance.now()

      // giới hạn fps để tránh quá tải gpu
      if (now - lastDetectTime >= FRAME_INTERVAL_MS && video.readyState >= 2) {
        // tránh gọi lại với cùng mốc thời gian
        if (now !== lastTime) {
          try {
            const result = landmarker.detectForVideo(video, now)
            lastTime = now
            lastDetectTime = now

            if (result.faceLandmarks && result.faceLandmarks.length > 0) {
              landmarksRef.current = result.faceLandmarks

              // trích xuất ma trận biến đổi (float32array[])
              const rawMatrices = result.facialTransformationMatrixes
              if (rawMatrices && rawMatrices.length > 0) {
                transformationMatricesRef.current = rawMatrices.map((m: any) => {
                  if (m instanceof Float32Array) return m
                  if (m?.data) return new Float32Array(m.data)
                  if (m?.packedData) return new Float32Array(m.packedData)
                  // dự phòng: thử diễn giải đối tượng như một mảng
                  return new Float32Array(Array.from(m as Iterable<number>))
                })
              } else {
                transformationMatricesRef.current = []
              }
            } else {
              landmarksRef.current = []
              transformationMatricesRef.current = []
            }
          } catch (e) {
            // detectforvideo có thể lỗi nếu video chưa sẵn sàng
            console.warn('bỏ qua khung hình nhận diện khuôn mặt:', e)
          }
        }
      }

      animFrameRef.current = requestAnimationFrame(detect)
    }

    animFrameRef.current = requestAnimationFrame(detect)
  }, [])

  const stopDetection = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current)
      animFrameRef.current = 0
    }
  }, [])

  const cleanup = useCallback(() => {
    stopDetection()

    // xóa các tham chiếu
    landmarksRef.current = []
    transformationMatricesRef.current = []

    if (landmarkerRef.current) {
      landmarkerRef.current.close()
      landmarkerRef.current = null
    }
    setIsModelReady(false)
  }, [stopDetection])

  return {
    isModelLoading,
    isModelReady,
    landmarksRef,
    transformationMatricesRef,
    initModel,
    startDetection,
    stopDetection,
    cleanup
  }
}
