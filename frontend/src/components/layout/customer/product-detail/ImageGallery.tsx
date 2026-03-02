import { ImageSlider } from '@/shared/components/ui'

interface ImageGalleryProps {
  images: string[]
}

export const ImageGallery = ({ images }: ImageGalleryProps) => {
  return (
    <ImageSlider
      images={images}
      aspectRatio="aspect-[4/3]"
      thumbnailSize={72}
      altPrefix="Product"
    />
  )
}
