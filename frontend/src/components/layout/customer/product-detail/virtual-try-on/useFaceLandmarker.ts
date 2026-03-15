import { useCallback, useRef, useState } from 'react'
import { FaceLandmarker, FilesetResolver, type NormalizedLandmark } from '@mediapipe/tasks-vision'

const WASM_CDN = 'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
const MODEL_CDN =
  'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'

export interface FaceLandmarks {
  landmarks: NormalizedLandmark[][]
  transformationMatrices?: any[]
}

export function useFaceLandmarker() {
  const [isModelLoading, setIsModelLoading] = useState(false)
  const [isModelReady, setIsModelReady] = useState(false)
  const landmarkerRef = useRef<FaceLandmarker | null>(null)
  const animFrameRef = useRef<number>(0)
  const landmarksRef = useRef<NormalizedLandmark[][]>([])
  const transformationMatricesRef = useRef<any[]>([])

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
        outputFacialTransformationMatrixes: true
      })
      landmarkerRef.current = faceLandmarker
      setIsModelReady(true)
    } catch (err) {
      console.error('Failed to init FaceLandmarker:', err)
      throw err
    } finally {
      setIsModelLoading(false)
    }
  }, [])

  const startDetection = useCallback((video: HTMLVideoElement) => {
    const landmarker = landmarkerRef.current
    if (!landmarker) return

    let lastTime = -1

    const detect = () => {
      if (video.readyState >= 2) {
        const now = performance.now()

        if (now !== lastTime) {
          const result = landmarker.detectForVideo(video, now)
          lastTime = now

          if (result.faceLandmarks && result.faceLandmarks.length > 0) {
            landmarksRef.current = result.faceLandmarks
            transformationMatricesRef.current = result.facialTransformationMatrixes || []
          } else {
            landmarksRef.current = []
            transformationMatricesRef.current = []
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
