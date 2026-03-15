import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { parseVietnameseDate } from '../utils/dateParser'
import { toast } from 'react-hot-toast'

interface VoiceDatePickerProps {
  label: string
  value: string
  onChange: (value: string) => void
  className?: string
  helperText?: string
}

export function VoiceDatePicker({
  label,
  value,
  onChange,
  className,
  helperText
}: VoiceDatePickerProps) {
  const [isListening, setIsListening] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)

  useEffect(() => {
    const SpeechRecognition =
      (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition()
      recognition.lang = 'vi-VN'
      recognition.continuous = false
      recognition.interimResults = false

      recognition.onstart = () => {
        setIsListening(true)
        setError(null)
      }

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript
        const parsedDate = parseVietnameseDate(transcript)

        if (parsedDate) {
          onChange(parsedDate)
          toast.success(`Đã nhận diện: ${transcript}`, { icon: '📅' })
        } else {
          setError('Không nhận diện được ngày tháng')
          toast.error(`Không hiểu: "${transcript}"`)
        }
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error)
        setIsListening(false)
        if (event.error === 'not-allowed') {
          setError('Micro bị chặn. Vui lòng cấp quyền.')
        } else {
          setError('Lỗi nhận diện âm thanh')
        }
      }

      recognition.onend = () => {
        setIsListening(false)
      }

      recognitionRef.current = recognition
    }
  }, [onChange])

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop()
    } else {
      if (!recognitionRef.current) {
        toast.error('Trình duyệt của bạn không hỗ trợ nhận diện giọng nói')
        return
      }
      setError(null)
      recognitionRef.current.start()
    }
  }

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex justify-between items-center ml-1">
        <label className="text-xs font-bold text-gray-700">{label}</label>
        {helperText && (
          <span className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
            {helperText}
          </span>
        )}
      </div>

      <div className="relative group">
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={cn(
            'w-full px-4 py-3 pr-12 bg-white border border-neutral-100 rounded-2xl text-[14px] focus:outline-none focus:ring-4 focus:ring-mint-500/10 focus:border-mint-500 transition-all appearance-none cursor-text',
            isListening && 'border-mint-500 ring-4 ring-mint-500/20 shadow-lg shadow-mint-100/50',
            error && 'border-red-300 ring-red-100'
          )}
        />

        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
          <button
            type="button"
            onClick={toggleListening}
            title={isListening ? 'Stop recording' : 'Speak date (Vietnamese)'}
            className={cn(
              'p-2 rounded-xl transition-all duration-300 hover:scale-110 active:scale-95',
              isListening
                ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200'
                : 'bg-mint-50 text-mint-600 hover:bg-mint-100 border border-mint-100 group-hover:bg-mint-100'
            )}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
        </div>

        {isListening && (
          <div className="absolute -bottom-10 left-0 right-0 py-1 px-3 bg-mint-600 text-white text-[10px] font-bold rounded-lg animate-in fade-in slide-in-from-top-1 z-10 flex items-center gap-2 shadow-lg">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
            </span>
            Đang nghe... (ví dụ: "Ngày 20 tháng 3")
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] font-bold text-red-500 ml-1 flex items-center gap-1 animate-in fade-in">
          <AlertCircle size={12} />
          {error}
        </p>
      )}
    </div>
  )
}
