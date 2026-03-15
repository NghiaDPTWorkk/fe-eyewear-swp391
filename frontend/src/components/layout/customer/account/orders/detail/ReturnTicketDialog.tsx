import { useState, useRef } from 'react'
import { IoClose, IoCloudUploadOutline, IoTrashOutline } from 'react-icons/io5'
import { Button } from '@/shared/components/ui/button'
import { createPortal } from 'react-dom'
import { toast } from 'react-hot-toast'
import { RETURN_TICKET_REASONS, type ReturnTicketReason } from '@/shared/types/return-ticket.types'
import { uploadMany } from '@/lib/upload'
import { returnService } from '@/features/customer/services/return.service'

interface ReturnTicketDialogProps {
  orderId: string
  orderCode: string
  trigger?: React.ReactNode
  onSuccess?: () => void
}

export function ReturnTicketDialog({
  orderId,
  orderCode,
  trigger,
  onSuccess
}: ReturnTicketDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [reason, setReason] = useState<ReturnTicketReason>('DAMAGE')
  const [otherReason, setOtherReason] = useState('')
  const [description, setDescription] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [previews, setPreviews] = useState<string[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleOpen = () => setIsOpen(true)
  const handleClose = () => {
    if (isSubmitting) return
    setIsOpen(false)
    // Reset form
    setReason('DAMAGE')
    setOtherReason('')
    setDescription('')
    setFiles([])
    setPreviews([])
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || [])
    if (selectedFiles.length + files.length > 5) {
      toast.error('Maximum 5 images allowed')
      return
    }

    const newFiles = [...files, ...selectedFiles]
    setFiles(newFiles)

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file))
    setPreviews([...previews, ...newPreviews])
  }

  const removeFile = (index: number) => {
    const newFiles = [...files]
    newFiles.splice(index, 1)
    setFiles(newFiles)

    const newPreviews = [...previews]
    URL.revokeObjectURL(newPreviews[index])
    newPreviews.splice(index, 1)
    setPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (reason === 'OTHER' && !otherReason.trim()) {
      toast.error('Please specify your reason')
      return
    }
    if (!description.trim()) {
      toast.error('Please provide a description')
      return
    }

    try {
      setIsSubmitting(true)

      let mediaUrls: string[] = []
      if (files.length > 0) {
        toast.loading('Uploading images...', { id: 'uploading' })
        mediaUrls = await uploadMany(files)
        toast.success('Images uploaded', { id: 'uploading' })
      }

      const response = await returnService.createReturnTicket({
        orderId,
        reason: reason === 'OTHER' ? otherReason : reason,
        description,
        media: mediaUrls
      })

      if (response.success) {
        toast.success('Return request submitted successfully')
        onSuccess?.()
        handleClose()
      } else {
        toast.error(response.message || 'Failed to submit return request')
      }
    } catch (error) {
      console.error('Error submitting return ticket:', error)
      toast.error('An error occurred. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {trigger ? (
        <div onClick={handleOpen}>{trigger}</div>
      ) : (
        <Button
          onClick={handleOpen}
          variant="outline"
          className="text-xs font-bold border-primary-500 text-primary-500 hover:bg-primary-50 rounded-xl px-4 py-2"
        >
          Request Return
        </Button>
      )}

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm transition-opacity"
              onClick={handleClose}
            />

            <div className="relative w-full max-w-lg bg-white rounded-[28px] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
              <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Return Request</h3>
                  <p className="text-xs text-gray-500 font-medium mt-1">Order #{orderCode}</p>
                </div>
                <button
                  onClick={handleClose}
                  className="p-2 hover:bg-white rounded-full transition-colors text-gray-400 hover:text-gray-900 shadow-sm"
                >
                  <IoClose size={20} />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Reason Selection */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700 ml-1">
                    Reason for Return
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {RETURN_TICKET_REASONS.map((r) => (
                      <button
                        key={r.value}
                        type="button"
                        onClick={() => setReason(r.value)}
                        className={`p-3 text-xs font-bold rounded-xl border-2 transition-all text-left flex items-center gap-2 ${
                          reason === r.value
                            ? 'border-primary-500 bg-primary-50 text-primary-700'
                            : 'border-gray-100 bg-transparent text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${reason === r.value ? 'bg-primary-500' : 'bg-gray-300'}`}
                        />
                        {r.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Other Reason Input */}
                {reason === 'OTHER' && (
                  <div className="space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <label className="text-[13px] font-bold text-gray-700 ml-1">
                      Please specify reason
                    </label>
                    <input
                      type="text"
                      value={otherReason}
                      onChange={(e) => setOtherReason(e.target.value)}
                      placeholder="Enter your reason here..."
                      className="w-full p-4 rounded-xl border-2 border-gray-100 focus:border-primary-500 focus:outline-none transition-colors text-sm font-medium"
                      required
                    />
                  </div>
                )}

                {/* Description */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700 ml-1">
                    Detailed Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Tell us more about the issue..."
                    className="w-full min-h-[100px] p-4 rounded-2xl border-2 border-gray-100 focus:border-primary-500 focus:outline-none transition-colors text-[14px] leading-relaxed resize-none"
                    required
                  />
                </div>

                {/* Media Upload */}
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-gray-700 ml-1">Images (max 5)</label>
                  <div className="flex flex-wrap gap-3">
                    {previews.map((src, idx) => (
                      <div
                        key={idx}
                        className="relative w-20 h-20 rounded-xl overflow-hidden group border border-gray-100 shadow-sm"
                      >
                        <img src={src} className="w-full h-full object-cover" alt="Preview" />
                        <button
                          type="button"
                          onClick={() => removeFile(idx)}
                          className="absolute top-1 right-1 p-1 bg-white/90 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-50"
                        >
                          <IoTrashOutline size={14} />
                        </button>
                      </div>
                    ))}
                    {previews.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-20 h-20 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-gray-400 hover:border-primary-400 hover:text-primary-500 hover:bg-primary-50/30 transition-all gap-1"
                      >
                        <IoCloudUploadOutline size={24} />
                        <span className="text-[9px] font-bold uppercase tracking-wider">
                          Add Photo
                        </span>
                      </button>
                    )}
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    multiple
                    className="hidden"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleClose}
                    disabled={isSubmitting}
                    className="flex-1 py-3.5 rounded-2xl font-bold text-gray-500 hover:bg-gray-100 shadow-none border-none"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-[2] py-3.5 rounded-2xl font-bold text-sm bg-primary-900 hover:bg-primary-700 text-white shadow-lg shadow-primary-200 transition-all active:scale-[0.98]"
                  >
                    {isSubmitting ? 'Sending Request...' : 'Submit Request'}
                  </Button>
                </div>
              </form>
            </div>
          </div>,
          document.body
        )}
    </>
  )
}
