import React, { useRef, useState } from 'react'
import { IoCloudUploadOutline, IoCloseCircle } from 'react-icons/io5'
import { uploadSingle } from '@/lib/upload'

interface ImageUploadProps {
  images: string[]
  onChange: (images: string[]) => void
}

export function ImageUpload({ images, onChange }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
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
      {images.length === 0 ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative h-40 border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center gap-3
            ${
              isHovered || isUploading
                ? 'border-mint-500 bg-mint-50/30'
                : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300'
            }
            ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <div
            className={`
            w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
            ${
              isHovered || isUploading
                ? 'bg-mint-500 text-white scale-110'
                : 'bg-white text-neutral-400 shadow-sm'
            }
          `}
          >
            <IoCloudUploadOutline size={24} />
          </div>
          <div className="text-center">
            <p className="text-[13px] font-bold text-slate-600">
              {isUploading ? 'Uploading images...' : 'Click or drag images to upload'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">PNG, JPG or WebP (Max 5MB each)</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {images.map((url, index) => (
            <div
              key={index}
              className="group relative w-24 h-24 rounded-2xl overflow-hidden border border-neutral-100 shadow-sm hover:shadow-md hover:border-mint-200 transition-all duration-300"
            >
              <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-full transition-all backdrop-blur-sm"
                  title="Remove image"
                >
                  <IoCloseCircle size={18} />
                </button>
              </div>
              {index === 0 && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-mint-500 text-white text-[8px] font-bold rounded-md shadow-sm">
                  MAIN
                </div>
              )}
            </div>
          ))}

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className={`
              w-24 h-24 flex flex-col items-center justify-center border-2 border-dashed rounded-2xl transition-all
              ${
                isUploading
                  ? 'bg-neutral-50 border-neutral-200 opacity-50 cursor-not-allowed'
                  : 'bg-neutral-50/50 border-neutral-200 hover:border-mint-400 hover:bg-mint-50/30 text-neutral-400 hover:text-mint-600'
              }
            `}
          >
            <IoCloudUploadOutline size={20} />
            <span className="text-[10px] font-bold mt-1">{isUploading ? '...' : 'Add More'}</span>
          </button>
        </div>
      )}

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
