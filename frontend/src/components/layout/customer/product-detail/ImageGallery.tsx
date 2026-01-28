import { useState } from 'react'

interface ImageGalleryProps {
  images: string[]
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [activeImage, setActiveImage] = useState(images[0] || '')

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
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
        />
      </div>

      {/* Thumbnails/Additional Images Grid */}
      <div className="grid grid-cols-2 gap-4">
        {images.slice(1, images.length).map((img, index) => (
          <div
            key={index}
            className={`aspect-square bg-white rounded-3xl overflow-hidden cursor-pointer border-2 transition-all ${
              activeImage === img
                ? 'border-primary-500 shadow-md scale-[0.98]'
                : 'border-mint-300 hover:border-primary-300'
            }`}
            onClick={() => setActiveImage(img)}
          >
            <img src={img} alt={`Gallery ${index}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>

      {images.length > 3 && (
        <div className="aspect-[4/2] bg-white rounded-3xl overflow-hidden border border-mint-300">
          <img src={images[3]} alt="Gallery focus" className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}
