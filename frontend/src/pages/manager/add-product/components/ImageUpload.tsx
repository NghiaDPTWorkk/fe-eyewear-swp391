import React, { useRef } from 'react'
import { IoCloudUploadOutline, IoCloseCircle } from 'react-icons/io5'
import { uploadSingle } from '@/lib/upload'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = React.useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
      const uploadPromises = Array.from(files).map((file) => uploadSingle(file))
      const uploadedUrls = await Promise.all(uploadPromises)
      onChange([...images, ...uploadedUrls])
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Failed to upload one or more images. Please contact support if problem persists.')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const removeImage = (index: number) => {
    const newImages = [...images]
    newImages.splice(index, 1)
    onChange(newImages)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4">
        {images.map((url, index) => (
          <div
            key={index}
            className="relative w-24 h-24 rounded-2xl overflow-hidden border border-neutral-100 group"
          >
            <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover" />
            <button
              type="button"
              onClick={() => removeImage(index)}
              className="absolute top-1 right-1 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <IoCloseCircle size={20} />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className={`w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed border-neutral-200 rounded-2xl transition-colors ${
            isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-neutral-50'
          }`}
        >
          <IoCloudUploadOutline size={24} className="text-neutral-400" />
          <span className="text-[10px] font-bold text-neutral-400 mt-1">
            {isUploading ? 'Uploading...' : 'Upload'}
          </span>
        </button>
      </div>

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple
        accept="image/*"
        className="hidden"
      />
    </div>
  )
}
