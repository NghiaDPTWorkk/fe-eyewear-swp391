import { useState, useEffect } from 'react'

interface ImageGalleryProps {
  images: string[]
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images[0] || '')

  // Update activeImage when images prop changes (e.g. variant switch)
  useEffect(() => {
    if (images.length > 0) {
      setActiveImage(images[0])
    }
  }, [images])

  if (images.length === 0) {
    return (
      <div className="aspect-[4/5] bg-white rounded-3xl flex items-center justify-center border-2 border-mint-300">
        <span className="text-gray-eyewear font-medium">No images available</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Main Image */}
      <div className="relative aspect-[4/3] bg-white rounded-3xl overflow-hidden shadow-sm border border-mint-300 group">
        <img
          src={activeImage}
          alt="Product view"
          className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Thumbnails Grid - show all images */}
      {images.length > 1 && (
        <div className="grid grid-cols-3 gap-3">
          {images.map((img, index) => (
            <div
              key={index}
              className={`aspect-square bg-white rounded-2xl overflow-hidden cursor-pointer border-2 transition-all flex items-center justify-center ${
                activeImage === img
                  ? 'border-primary-500 shadow-md scale-[0.98]'
                  : 'border-mint-300 hover:border-primary-300'
              }`}
              onClick={() => setActiveImage(img)}
            >
              <img
                src={img}
                alt={`Gallery ${index + 1}`}
                className="w-full h-full object-contain"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
