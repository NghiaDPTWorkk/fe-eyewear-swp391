import React, { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { IoCloseOutline, IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5'

interface ManagerViewImageProps {
  isOpen: boolean
  onClose: () => void
  images: string[]
  currentIndex: number
  onIndexChange: (index: number) => void
}

export default function ManagerViewImage({
  isOpen,
  onClose,
  images,
  currentIndex,
  onIndexChange
}: ManagerViewImageProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || images.length === 0) return null

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation()
    onIndexChange(currentIndex > 0 ? currentIndex - 1 : images.length - 1)
  }

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation()
    onIndexChange(currentIndex < images.length - 1 ? currentIndex + 1 : 0)
  }

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300"
      onClick={onClose}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
      >
        <IoCloseOutline size={32} />
      </button>

      {/* Navigation Buttons */}
      {images.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            className="absolute left-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
          >
            <IoChevronBackOutline size={28} />
          </button>
          <button
            onClick={handleNext}
            className="absolute right-10 w-12 h-12 flex items-center justify-center bg-white/10 hover:bg-white/20 text-white rounded-full transition-all z-10"
          >
            <IoChevronForwardOutline size={28} />
          </button>
        </>
      )}

      {/* Main Image */}
      <div
        className="relative max-w-[50vw] max-h-[80vh] flex items-center justify-center select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={images[currentIndex]}
          alt={`Preview ${currentIndex + 1}`}
          className="max-w-full max-h-full object-contain rounded-2xl shadow-2xl animate-in zoom-in-95 duration-300 ring-1 ring-white/10"
        />

        {/* Counter */}
        <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-white/10 backdrop-blur-md rounded-full text-sm font-bold text-white tracking-widest uppercase">
          {currentIndex + 1} / {images.length}
        </div>
      </div>
    </div>,
    document.body
  )
}
