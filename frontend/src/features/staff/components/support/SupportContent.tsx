import {
  IoCloudUploadOutline,
  IoAlertCircleOutline,
  IoChevronForwardOutline,
  IoChevronBackOutline,
  IoSearchOutline
} from 'react-icons/io5'
import { Card, Button } from '@/shared/components/ui-core'
import { useState, useRef, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { supportService } from '../../services/support.service'
import { uploadSingle } from '@/lib/upload'
import { PrioritySelect } from './PrioritySelect'
import { useSupportHistory } from '../../hooks/useSupport'
import { RiskGuidelines } from './RiskGuidelines'
import { ImportantContacts } from './ImportantContacts'

interface SupportGuideline {
  title: string
  items: string[]
}

interface SupportContact {
  role: string
  email: string
  phone: string
  isEmergency?: boolean
}

interface SupportContentProps {
  guidelines: SupportGuideline[]
  contacts: SupportContact[]
  criticalReminder: string
  accentColor?: string
}

export default function SupportContent({
  guidelines,
  contacts,
  criticalReminder,
  accentColor = 'mint'
}: SupportContentProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priorityLevel: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    imageUrl: null as string | null
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const queryClient = useQueryClient()
  const [searchParams, setSearchParams] = useSearchParams()
  const isHistoryTab = searchParams.get('tab') === 'history'
  const { data: historyList, isLoading: isHistoryLoading } = useSupportHistory()

  const sortedHistory = useMemo(() => {
    if (!historyList) return []
    return [...historyList].sort((a, b) => {
      const parseDate = (d: string) => {
        const parts = d.split(' ')
        if (parts.length < 2) return 0
        const [time, date] = parts
        const [dd, mm, yyyy] = date.split('/')
        if (!dd || !mm || !yyyy) return 0
        const [hh, min, ss] = time.split(':')
        return new Date(+yyyy, +mm - 1, +dd, +hh, +min, +ss).getTime()
      }
      return parseDate(b.createdAt) - parseDate(a.createdAt)
    })
  }, [historyList])

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const url = await uploadSingle(file)
      setFormData((prev) => ({ ...prev, imageUrl: url }))
      toast.success('Image uploaded successfully')
    } catch (error) {
      console.error('Upload failed:', error)
      toast.error('Failed to upload image')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.description) {
      toast.error('Please fill in both title and description')
      return
    }
    setIsSubmitting(true)
    try {
      const response = await supportService.createReportTicket(formData)
      if (response.success) {
        toast.success(response.message || 'Ticket submitted successfully')
        queryClient.invalidateQueries({ queryKey: ['reportHistory'] })
        setFormData({ title: '', description: '', priorityLevel: 'MEDIUM', imageUrl: null })
      } else {
        toast.error(response.message || 'Failed to submit ticket')
      }
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } }; message?: string }
      toast.error(error.response?.data?.message || error.message || 'Something went wrong')
    } finally {
      setIsSubmitting(false)
    }
  }

  const buttonBgClass =
    accentColor === 'mint' ? 'bg-mint-600 hover:bg-mint-700' : 'bg-primary-600 hover:bg-primary-700'
  const statusClass = (status: string) => {
    if (status === 'PENDING') return 'bg-amber-50 text-amber-600 border-amber-100'
    return accentColor === 'mint'
      ? 'bg-mint-50 text-mint-600 border-mint-100'
      : 'bg-primary-50 text-primary-600 border-primary-100'
  }

  if (isHistoryTab) {
    return (
      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => {
              searchParams.delete('tab')
              setSearchParams(searchParams)
            }}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-semibold"
          >
            <IoChevronBackOutline /> Back to Reporting
          </Button>
          <div className="flex gap-2">
            <div className="relative">
              <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search reports..."
                className="pl-10 pr-4 py-2 bg-white border border-neutral-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/10 placeholder:text-slate-400 font-medium"
              />
            </div>
          </div>
        </div>

        <Card className="p-0 border-none shadow-sm shadow-neutral-200/50 bg-white rounded-3xl overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex items-center justify-between bg-neutral-50/30">
            <h2 className="text-xl font-semibold text-slate-900 tracking-tight">Report History</h2>
            <span className="px-3 py-1 bg-white border border-neutral-200 rounded-full text-[10px] font-semibold text-slate-500 uppercase tracking-widest shadow-sm">
              {sortedHistory.length} Total Reports
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50/50">
                  <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Ticket Info
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Status
                  </th>
                  <th className="px-6 py-4 text-[10px] font-semibold text-slate-400 uppercase tracking-widest">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {isHistoryLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-6 py-8">
                        <div className="h-4 bg-neutral-100 rounded-full w-48 mb-2" />
                        <div className="h-3 bg-neutral-50 rounded-full w-96" />
                      </td>
                    </tr>
                  ))
                ) : sortedHistory.length > 0 ? (
                  sortedHistory.map((report) => (
                    <tr key={report.id} className="hover:bg-neutral-50/50 transition-colors group">
                      <td className="px-6 py-5 max-w-xs md:max-w-sm lg:max-w-md">
                        <h4 className="text-sm font-semibold text-slate-800 group-hover:text-primary-600 transition-colors break-words">
                          {report.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1 font-medium break-words">
                          {report.description}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-widest border ${
                            report.priorityLevel === 'HIGH'
                              ? 'bg-rose-50 text-rose-600 border-rose-100'
                              : report.priorityLevel === 'MEDIUM'
                                ? 'bg-amber-50 text-amber-600 border-amber-100'
                                : 'bg-slate-50 text-slate-600 border-slate-100'
                          }`}
                        >
                          {report.priorityLevel}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`px-2.5 py-1 rounded-lg text-[9px] font-semibold uppercase tracking-widest border ${statusClass(report.status)}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <p className="text-xs text-slate-400 font-semibold">{report.createdAt}</p>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-20 text-center">
                      <div className="max-w-xs mx-auto space-y-3">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-300 mx-auto">
                          <IoAlertCircleOutline size={24} />
                        </div>
                        <p className="text-sm font-semibold text-slate-400">
                          No report history found
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-8 space-y-8">
        <RiskGuidelines guidelines={guidelines} accentColor={accentColor} />
        <ImportantContacts contacts={contacts} accentColor={accentColor} />
      </div>
      <div className="lg:col-span-4 space-y-8">
        <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white rounded-3xl">
          <h2 className="text-xl font-semibold text-slate-900 mb-8 tracking-tight">Report a Bug</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-slate-400 tracking-widest pl-1 uppercase">
                Bug Title *
              </label>
              <input
                type="text"
                placeholder="Brief description of the issue"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                className={`w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all cursor-pointer ${accentColor === 'mint' ? 'focus:ring-mint-500/10 focus:border-mint-500' : 'focus:ring-primary-500/10 focus:border-primary-500'}`}
              />
            </div>

            <PrioritySelect
              value={formData.priorityLevel}
              onChange={(val) => setFormData((prev) => ({ ...prev, priorityLevel: val }))}
              accentColor={accentColor}
            />

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-slate-400 tracking-widest pl-1 uppercase">
                Description *
              </label>
              <textarea
                rows={4}
                placeholder="Describe the bug in detail..."
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                className={`w-full px-5 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-semibold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-4 transition-all resize-none cursor-pointer ${accentColor === 'mint' ? 'focus:ring-mint-500/10 focus:border-mint-500' : 'focus:ring-primary-500/10 focus:border-primary-500'}`}
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-semibold text-slate-400 tracking-widest pl-1 uppercase">
                Screenshot
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed border-slate-200 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 transition-all cursor-pointer group ${accentColor === 'mint' ? 'hover:border-mint-300 hover:bg-mint-50/20' : 'hover:border-primary-300 hover:bg-primary-50/20'}`}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                  accept="image/*"
                />
                {formData.imageUrl ? (
                  <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-neutral-200">
                    <img
                      src={formData.imageUrl}
                      alt="Bug description"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-slate-900/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <p className="text-white text-xs font-semibold">Change Image</p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div
                      className={`w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center transition-all ${accentColor === 'mint' ? 'group-hover:bg-mint-100 group-hover:text-mint-600' : 'group-hover:bg-primary-100 group-hover:text-primary-600'}`}
                    >
                      {isUploading ? (
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary-500 border-t-transparent" />
                      ) : (
                        <IoCloudUploadOutline size={24} className="text-slate-400" />
                      )}
                    </div>
                    <div className="text-center">
                      <p
                        className={`text-xs font-semibold text-slate-700 ${accentColor === 'mint' ? 'group-hover:text-mint-700' : 'group-hover:text-primary-700'}`}
                      >
                        {isUploading ? 'Uploading...' : 'Click to upload'}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                        PNG, JPG up to 5MB
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Button
              variant="solid"
              type="submit"
              isLoading={isSubmitting}
              disabled={isUploading}
              className={`w-full h-12 rounded-2xl font-semibold shadow-lg transition-all active:scale-95 text-sm tracking-wider text-white border-none ${buttonBgClass}`}
            >
              Submit Bug Report
            </Button>
          </form>

          <div className="mt-12 space-y-6">
            <h3 className="text-[10px] font-semibold text-slate-400 uppercase tracking-widest pl-1">
              Recent Reports
            </h3>
            <div className="space-y-3">
              {isHistoryLoading ? (
                <div className="p-8 text-center bg-neutral-50 rounded-2xl">
                  <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-500 border-t-transparent mx-auto" />
                </div>
              ) : historyList && historyList.length > 0 ? (
                historyList.slice(0, 5).map((report) => (
                  <div
                    key={report.id}
                    className="flex justify-between items-start p-4 bg-white border border-neutral-100 rounded-2xl shadow-sm transition-all group hover:scale-[1.02] cursor-pointer hover:border-neutral-200"
                  >
                    <div className="flex-1 pr-3 min-w-0">
                      <h4 className="text-sm font-semibold text-slate-800 transition-colors truncate">
                        {report.title}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-1 font-semibold">
                        {report.createdAt}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-xl text-[9px] font-semibold uppercase tracking-widest border shrink-0 ${statusClass(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-400 text-center py-4 font-semibold">
                  No history available
                </p>
              )}
            </div>
            <button
              type="button"
              onClick={() => {
                searchParams.set('tab', 'history')
                setSearchParams(searchParams)
              }}
              className="w-full py-3 text-xs font-semibold text-primary-600 hover:text-primary-700 flex items-center justify-center gap-1 transition-colors cursor-pointer"
            >
              View All History <IoChevronForwardOutline />
            </button>
          </div>
        </Card>
      </div>
      <div className="p-6 bg-rose-50 border border-rose-100 rounded-[24px] flex gap-5 animate-in fade-in slide-in-from-bottom-4 duration-500 col-span-full shadow-sm shadow-rose-100/30">
        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shrink-0 shadow-sm border border-rose-100/50">
          <IoAlertCircleOutline className="text-rose-500" size={26} />
        </div>
        <div>
          <h4 className="text-sm font-semibold text-rose-900 tracking-tight">Critical Reminder</h4>
          <p className="text-sm text-rose-800/80 mt-1 leading-relaxed font-semibold">
            {criticalReminder}
          </p>
        </div>
      </div>
    </div>
  )
}
