import React from 'react'
import { IoAdd, IoRemove, IoRefresh, IoEyeOutline } from 'react-icons/io5'
import { Button, Card } from '@/shared/components/ui'

interface ImageViewerProps {
  imageUrl?: string
  zoom: number
  rotation: number
  setZoom: React.Dispatch<React.SetStateAction<number>>
  setRotation: React.Dispatch<React.SetStateAction<number>>
}

export const ImageViewer: React.FC<ImageViewerProps> = ({
  imageUrl,
  zoom,
  rotation,
  setZoom,
  setRotation
}) => {
  return (
    <Card className="p-0 overflow-hidden h-[500px] flex flex-col border border-gray-200 shadow-sm rounded-xl bg-white">
      <div className="flex justify-between items-center px-4 py-3 border-b border-gray-200 bg-white">
        <h3 className="font-medium text-gray-700 text-sm flex items-center gap-2">
          <IoEyeOutline /> PRESCRIPTION SCAN
        </h3>
        <div className="flex gap-2">
          <Button
            onClick={() => setZoom((prev) => Math.min(prev + 10, 200))}
            variant="ghost"
            colorScheme="neutral"
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all border border-transparent hover:border-slate-200"
            title="Zoom In"
          >
            <IoAdd size={18} />
          </Button>
          <span className="text-xs font-mono font-medium text-gray-500 self-center w-12 text-center bg-white px-2 py-0.5 rounded border border-gray-100">
            {zoom}%
          </span>
          <Button
            onClick={() => setZoom((prev) => Math.max(prev - 10, 50))}
            variant="ghost"
            colorScheme="neutral"
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all border border-transparent hover:border-slate-200"
            title="Zoom Out"
          >
            <IoRemove size={18} />
          </Button>
          <div className="w-px h-5 bg-gray-300 mx-1 self-center" />
          <Button
            onClick={() => setRotation((prev) => prev + 90)}
            variant="ghost"
            colorScheme="neutral"
            className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-slate-500 transition-all border border-transparent hover:border-slate-200"
            title="Rotate"
          >
            <IoRefresh size={18} />
          </Button>
        </div>
      </div>

      <div className="flex-1 bg-neutral-100/50 flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/graphy.png')] opacity-20" />
        <div className="absolute inset-0 flex items-center justify-center p-6 transition-all duration-300">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Prescription"
              className="max-w-full max-h-full object-contain shadow-2xl rounded-sm transition-transform duration-200 ease-out"
              style={{ transform: `rotate(${rotation}deg) scale(${zoom / 100})` }}
            />
          ) : (
            <div
              className="w-full max-w-sm aspect-[3/4] bg-neutral-100 border-2 border-dashed border-neutral-200 rounded-3xl flex flex-col items-center justify-center p-12 text-center group transition-all"
              style={{ transform: `rotate(${rotation}deg) scale(${zoom / 100})` }}
            >
              <div className="bg-neutral-200/50 px-6 py-12 rounded-2xl border border-neutral-200 shadow-inner">
                <p className="text-slate-400 font-semibold text-2xl tracking-tighter opacity-50">
                  Prescription Scan
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  )
}
