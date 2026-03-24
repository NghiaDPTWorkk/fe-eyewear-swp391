import { useCallback, useRef, useState, useMemo } from 'react'
import { FaceLandmarker, FilesetResolver, type NormalizedLandmark } from '@mediapipe/tasks-vision'

const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.32/wasm'
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
  const isInitializingRef = useRef(false)
  const animFrameRef = useRef<number>(0)
  const landmarksRef = useRef<NormalizedLandmark[][]>([])
  const transformationMatricesRef = useRef<Float32Array[]>([])

  const initModel = useCallback(async () => {
    if (landmarkerRef.current) {
      console.log('[useFaceLandmarker] Model already initialized.')
      setIsModelReady(true)
      return
    }

    if (isInitializingRef.current) {
      console.log('[useFaceLandmarker] Initialization already in progress...')
      return
    }
    isInitializingRef.current = true

    setIsModelLoading(true)
    try {
      console.log('Starting FaceLandmarker initialization...')
      const vision = await FilesetResolver.forVisionTasks(WASM_CDN)
      const faceLandmarker = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: MODEL_CDN,
          delegate: 'CPU'
        },
        runningMode: 'VIDEO',
        numFaces: 1,
        outputFaceBlendshapes: false,
        outputFacialTransformationMatrixes: true
      })
      landmarkerRef.current = faceLandmarker
      setIsModelReady(true)
      console.log('FaceLandmarker ready.')
    } catch (err) {
      console.error('lỗi khởi tạo facelandmarker:', err)
      throw err
    } finally {
      setIsModelLoading(false)
      isInitializingRef.current = false
    }
  }, [])

  const startDetection = useCallback((video: HTMLVideoElement) => {
    const landmarker = landmarkerRef.current
    if (!landmarker) {
      console.warn('[useFaceLandmarker] Cannot start detection - model not ready.')
      return
    }

    if (animFrameRef.current) {
      console.log('[useFaceLandmarker] Detection loop already running.')
      return
    }

    console.log('[useFaceLandmarker] Starting detection loop.')
    let lastTime = -1
    let lastDetectTime = 0

    const detect = () => {
      // If component unmounted or landmarker closed
      if (!landmarkerRef.current) return

      const now = performance.now()

      // giới hạn fps để tránh quá tải gpu
      // readyState 3+ means enough data to play
      if (now - lastDetectTime >= FRAME_INTERVAL_MS && video.readyState >= 3) {
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
                try {
                  transformationMatricesRef.current = rawMatrices.map((m: any) => {
                    if (m instanceof Float32Array) return m
                    if (m?.data) return new Float32Array(m.data)
                    return new Float32Array(Array.from(m as Iterable<number>))
                  })
                } catch (mapErr) {
                  console.warn('[useFaceLandmarker] Matrix mapping error:', mapErr)
                }
              } else {
                transformationMatricesRef.current = []
              }
            } else {
              landmarksRef.current = []
              transformationMatricesRef.current = []
            }
          } catch (e) {
            console.warn('[useFaceLandmarker] detectForVideo exception:', e)
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

  return useMemo(
    () => ({
      isModelLoading,
      isModelReady,
      landmarksRef,
      transformationMatricesRef,
      initModel,
      startDetection,
      stopDetection,
      cleanup
    }),
    [isModelLoading, isModelReady, initModel, startDetection, stopDetection, cleanup]
  )
}
