import React, { useRef, useState } from 'react'
import { IoCubeOutline, IoTrashOutline, IoCloudUploadOutline, IoSyncOutline } from 'react-icons/io5'
import { uploadSingle } from '@/lib/upload'
import { toast } from 'react-hot-toast'

interface Model3DUploadProps {
  value?: string
  onChange: (value: string) => void
}

export function Model3DUpload({ value, onChange }: Model3DUploadProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    try {
      const url = await uploadSingle(file)
      onChange(url)
      toast.success('3D Model uploaded!')
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-[11px] font-extrabold text-neutral-500 ml-1">3D Model (.glb)</label>

      {!value ? (
        <div
          onClick={() => !isUploading && fileInputRef.current?.click()}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className={`
            relative h-40 border-2 border-dashed rounded-3xl transition-all duration-300 cursor-pointer
            flex flex-col items-center justify-center gap-3
            ${
              isUploading
                ? 'border-neutral-200 bg-neutral-50/30 cursor-wait'
                : isHovered
                  ? 'border-mint-500 bg-mint-50/30'
                  : 'border-neutral-200 bg-neutral-50/50 hover:border-neutral-300'
            }
          `}
        >
          <div
            className={`
            w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300
            ${
              isUploading
                ? 'bg-neutral-100 text-neutral-400 animate-spin'
                : isHovered
                  ? 'bg-mint-500 text-white scale-110'
                  : 'bg-white text-neutral-400 shadow-sm'
            }
          `}
          >
            {isUploading ? <IoSyncOutline size={24} /> : <IoCloudUploadOutline size={24} />}
          </div>
          <div className="text-center px-4">
            <p className="text-[13px] font-bold text-slate-600">
              {isUploading ? 'Uploading precision model...' : 'Click or drag `.glb` file to upload'}
            </p>
            <p className="text-[11px] text-slate-400 mt-1">
              {isUploading ? 'Please wait while we process the 3D assets' : 'Maximum size: 50MB'}
            </p>
          </div>
        </div>
      ) : (
        <div className="group relative flex items-center justify-between p-4 bg-white border border-neutral-100/50 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-mint-50 rounded-xl flex items-center justify-center text-mint-600 ring-4 ring-mint-500/5">
              <IoCubeOutline size={24} />
            </div>
            <div>
              <p className="text-[13px] font-bold text-slate-700 truncate max-w-[200px]">{value}</p>
              <p className="text-[11px] text-slate-400">3D Model ready for Try-On</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onChange('')}
            className="p-2 text-neutral-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
            title="Remove 3D model"
          >
            <IoTrashOutline size={18} />
          </button>
        </div>
      )}

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".glb"
        className="hidden"
      />
    </div>
  )
}
