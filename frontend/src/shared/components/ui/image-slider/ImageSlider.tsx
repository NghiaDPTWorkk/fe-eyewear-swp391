import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ImageSliderProps {
  /** Array of image URLs to display */
  images: string[]
  /** CSS class for the outer wrapper */
  className?: string
  /** Aspect ratio class for the main image (default: 'aspect-[4/3]') */
  aspectRatio?: string
  /** Thumbnail size in px (default: 72) */
  thumbnailSize?: number
  /** Alt text prefix (default: 'Image') */
  altPrefix?: string
  /** Placeholder when no images */
  emptyPlaceholder?: React.ReactNode
}

export function ImageSlider({
  images,
  className,
  aspectRatio = 'aspect-[4/3]',
  thumbnailSize = 72,
  altPrefix = 'Image',
  emptyPlaceholder
}: ImageSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const thumbContainerRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Reset to first image when images array changes
  useEffect(() => {
    setActiveIndex(0)
  }, [images])

  // Check thumbnail scroll state
  const updateScrollState = useCallback(() => {
    const el = thumbContainerRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 2)
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 2)
  }, [])

  useEffect(() => {
    const el = thumbContainerRef.current
    if (!el) return
    updateScrollState()
    el.addEventListener('scroll', updateScrollState, { passive: true })
    // Also check on resize
    const ro = new ResizeObserver(updateScrollState)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateScrollState)
      ro.disconnect()
    }
  }, [images, updateScrollState])

  // Scroll thumbnail into view when active changes
  useEffect(() => {
    const el = thumbContainerRef.current
    if (!el) return
    const thumb = el.children[activeIndex] as HTMLElement | undefined
    if (thumb) {
      thumb.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  }, [activeIndex])

  const scrollThumbs = (direction: 'left' | 'right') => {
    const el = thumbContainerRef.current
    if (!el) return
    const scrollAmount = thumbnailSize * 3
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    })
  }

  if (images.length === 0) {
    return (
      <div className={cn(aspectRatio, 'bg-white rounded-3xl flex items-center justify-center border-2 border-mint-300', className)}>
        {emptyPlaceholder || (
          <span className="text-gray-eyewear font-medium">No images available</span>
        )}
      </div>
    )
  }

  const activeImage = images[activeIndex] || images[0]

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Image */}
      <div className={cn(
        'relative bg-white rounded-3xl overflow-hidden shadow-sm border border-mint-300 group',
        aspectRatio
      )}>
        <img
          src={activeImage}
          alt={`${altPrefix} ${activeIndex + 1}`}
          className="w-full h-full object-contain transition-all duration-500"
        />

        {/* Prev/Next arrows on main image */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i <= 0 ? images.length - 1 : i - 1))}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5 text-mint-1200" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i >= images.length - 1 ? 0 : i + 1))}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:scale-110 shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5 text-mint-1200" />
            </button>
          </>
        )}

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-sm text-white text-xs font-medium px-3 py-1 rounded-full">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Slider */}
      {images.length > 1 && (
        <div className="relative group/thumbs">
          {/* Left arrow */}
          {canScrollLeft && (
            <button
              onClick={() => scrollThumbs('left')}
              className="absolute left-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-r from-white/90 to-transparent flex items-center justify-center transition-opacity"
              aria-label="Scroll thumbnails left"
            >
              <ChevronLeft className="w-4 h-4 text-mint-1200" />
            </button>
          )}

          {/* Thumbnails container */}
          <div
            ref={thumbContainerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide px-1 py-1"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={cn(
                  'flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all duration-200',
                  activeIndex === index
                    ? 'border-primary-500 shadow-md ring-2 ring-primary-200'
                    : 'border-mint-300 hover:border-primary-300 opacity-70 hover:opacity-100'
                )}
                style={{ width: thumbnailSize, height: thumbnailSize }}
                aria-label={`View image ${index + 1}`}
              >
                <img
                  src={img}
                  alt={`${altPrefix} thumbnail ${index + 1}`}
                  className="w-full h-full object-contain bg-white"
                />
              </button>
            ))}
          </div>

          {/* Right arrow */}
          {canScrollRight && (
            <button
              onClick={() => scrollThumbs('right')}
              className="absolute right-0 top-0 bottom-0 z-10 w-8 bg-gradient-to-l from-white/90 to-transparent flex items-center justify-center transition-opacity"
              aria-label="Scroll thumbnails right"
            >
              <ChevronRight className="w-4 h-4 text-mint-1200" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
