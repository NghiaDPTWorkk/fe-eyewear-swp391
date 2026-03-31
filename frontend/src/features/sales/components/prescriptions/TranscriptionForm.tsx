import React from 'react'
import {
  IoCheckmark,
  IoClose,
  IoEyeOutline,
  IoInformationCircleOutline,
  IoPersonOutline,
  IoWarningOutline
} from 'react-icons/io5'
import { Button, Card, Input } from '@/shared/components/ui-core'

interface TranscriptionFormProps {
  parameters: any
  onParametersChange?: (params: any) => void
  note?: string
  onNoteChange?: (note: string) => void
  isReadOnly: boolean
  isApproved: boolean
  isRejected: boolean
  isCanceled?: boolean
  canceledByName?: string
  cancelNote?: string
  processing: boolean
  handleApprove: () => void
  handleReject: () => void
  assignStaff?: string
  staffName?: string
  actionTime?: string
  rejectionNote?: string
}

const VALIDATION_RULES = {
  SPH: { min: -20.0, max: 20.0, step: 0.25 },
  CYL: { min: -20.0, max: 20.0, step: 0.25 },
  AXIS: { min: 0, max: 180, step: 1 },
  ADD: { min: 0.75, max: 3.5, step: 0.25 },
  PD: { min: 35, max: 65, step: 0.5 }
}

const validateNote = (value: string): string | null => {
  if (!value || value.trim().length === 0) return 'Note is required'
  if (value.trim().length < 10) return 'Note must be at least 10 characters'
  if (/^\d+$/.test(value.trim())) return 'Note cannot consist of numbers only'
  return null
}

export const TranscriptionForm: React.FC<TranscriptionFormProps> = ({
  parameters,
  onParametersChange,
  note,
  onNoteChange,
  isReadOnly,
  isApproved,
  isRejected,
  isCanceled = false,
  canceledByName,
  cancelNote,
  processing,
  handleApprove,
  handleReject,
  assignStaff,
  staffName,
  actionTime,
  rejectionNote
}) => {
  const [numericErrors, setNumericErrors] = React.useState<Record<string, string>>({})
  const [noteTouched, setNoteTouched] = React.useState(true)

  const isAxisRequired = React.useCallback(
    (eye: 'left' | 'right') => {
      const cylVal = Number(parameters?.[eye]?.CYL) || 0
      return cylVal !== 0
    },
    [parameters]
  )

  const noteError = noteTouched ? validateNote(note ?? '') : null
  const isNoteValid = validateNote(note ?? '') === null
  const hasNumericErrors = Object.keys(numericErrors).length > 0

  const validateNumericField = (field: string, value: string): string | null => {
    if (value === '' || value === '-' || value === '.') return 'Required'
    const num = parseFloat(value)
    if (isNaN(num)) return 'Invalid number'

    switch (field) {
      case 'SPH':
      case 'CYL': {
        const rule = field === 'SPH' ? VALIDATION_RULES.SPH : VALIDATION_RULES.CYL
        if (num < rule.min || num > rule.max) return `Must be between ${rule.min} and ${rule.max}`
        break
      }
      case 'AXIS':
        if (num < VALIDATION_RULES.AXIS.min || num > VALIDATION_RULES.AXIS.max)
          return `Must be between ${VALIDATION_RULES.AXIS.min} and ${VALIDATION_RULES.AXIS.max}`
        break
      case 'ADD':
        if (num < VALIDATION_RULES.ADD.min || num > VALIDATION_RULES.ADD.max)
          return `Must be between ${VALIDATION_RULES.ADD.min} and ${VALIDATION_RULES.ADD.max}`
        break
      case 'PD':
        if (num < VALIDATION_RULES.PD.min || num > VALIDATION_RULES.PD.max)
          return `Must be between ${VALIDATION_RULES.PD.min} and ${VALIDATION_RULES.PD.max}`
        break
    }
    return null
  }

  const warnings = React.useMemo(() => {
    const w: string[] = []

    const checkStep = (val: string, step: number, fieldName: string) => {
      if (!val) return
      const num = parseFloat(val)
      if (isNaN(num)) return
      if (Math.abs((num * 100) % (step * 100)) > 0.01) {
        w.push(`${fieldName} value is usually a multiple of ${step}`)
      }
    }

    ;(['right', 'left'] as const).forEach((eye) => {
      const label = eye === 'right' ? 'Right Eye' : 'Left Eye'
      const p = parameters?.[eye]
      if (!p) return

      checkStep(p.SPH, VALIDATION_RULES.SPH.step, `${label} SPH`)
      checkStep(p.CYL, VALIDATION_RULES.CYL.step, `${label} CYL`)
      checkStep(p.ADD, VALIDATION_RULES.ADD.step, `${label} ADD`)

      const sph = Math.abs(parseFloat(p.SPH))
      const cyl = Math.abs(parseFloat(p.CYL))
      if (sph > 10 || cyl > 4) {
        w.push(`${label} prescription is quite high. Verify carefully.`)
      }
    })

    if (parameters?.PD) {
      checkStep(parameters.PD, VALIDATION_RULES.PD.step, 'PD')
    }

    const addR = parseFloat(parameters?.right?.ADD)
    const addL = parseFloat(parameters?.left?.ADD)
    if (!isNaN(addR) && !isNaN(addL) && addR !== addL) {
      w.push('ADD values for both eyes are typically identical.')
    }

    return w
  }, [parameters])

  React.useEffect(() => {
    const errors: Record<string, string> = {}

    ;['SPH', 'CYL', 'AXIS', 'ADD'].forEach((field) => {
      const val = (parameters?.right?.[field] ?? '').toString()
      const err = validateNumericField(field, val)
      if (err) errors[`right_${field}`] = err
    })
    ;['SPH', 'CYL', 'AXIS', 'ADD'].forEach((field) => {
      const val = (parameters?.left?.[field] ?? '').toString()
      const err = validateNumericField(field, val)
      if (err) errors[`left_${field}`] = err
    })

    const pdVal = (parameters?.PD ?? '').toString()
    const pdErr = validateNumericField('PD', pdVal)
    if (pdErr) errors['common_PD'] = pdErr

    setNumericErrors(errors)
  }, [parameters])

  React.useEffect(() => {
    if (!onParametersChange) return
    let changed = false
    const newParams = { ...parameters }

    if (
      !isAxisRequired('right') &&
      parameters?.right?.AXIS !== '0' &&
      parameters?.right?.AXIS !== 0
    ) {
      newParams.right = { ...newParams.right, AXIS: '0' }
      changed = true
    }
    if (!isAxisRequired('left') && parameters?.left?.AXIS !== '0' && parameters?.left?.AXIS !== 0) {
      newParams.left = { ...newParams.left, AXIS: '0' }
      changed = true
    }

    if (changed) {
      onParametersChange(newParams)
    }
  }, [
    parameters?.right?.CYL,
    parameters?.left?.CYL,
    onParametersChange,
    parameters,
    isAxisRequired
  ])

  const handleChange = (eye: 'left' | 'right' | 'common', field: string, value: string) => {
    if (!onParametersChange) return

    const normalizedValue = value.replace(',', '.')

    if (
      normalizedValue !== '' &&
      normalizedValue !== '-' &&
      normalizedValue !== '.' &&
      normalizedValue !== '-.' &&
      !/^-?\d*\.?\d*$/.test(normalizedValue)
    ) {
      return
    }

    const errorKey = `${eye}_${field}`
    const error = validateNumericField(field, normalizedValue)
    if (error) {
      setNumericErrors((prev) => ({ ...prev, [errorKey]: error }))
    } else {
      setNumericErrors((prev) => {
        const n = { ...prev }
        delete n[errorKey]
        return n
      })
    }

    const newParams = { ...parameters }

    if (eye === 'common') {
      newParams[field] = normalizedValue
    } else {
      newParams[eye] = {
        ...newParams[eye],
        [field]: normalizedValue
      }
    }

    onParametersChange(newParams)
  }

  const handleNumericBlur = (eye: 'left' | 'right' | 'common', field: string, value: string) => {
    const errorKey = `${eye}_${field}`
    const error = validateNumericField(field, value)
    if (error) {
      setNumericErrors((prev) => ({ ...prev, [errorKey]: error }))
    } else {
      setNumericErrors((prev) => {
        const n = { ...prev }
        delete n[errorKey]
        return n
      })
    }
  }

  const handleApproveWithValidation = () => {
    setNoteTouched(true)
    if (!isNoteValid || hasNumericErrors) return
    handleApprove()
  }

  return (
    <Card className="p-0 border border-gray-200 shadow-sm rounded-xl bg-white text-slate-700 overflow-visible relative">
      <div className="px-5 py-4 bg-white border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center border border-slate-100">
            <IoInformationCircleOutline size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h3 className="text-base font-semibold text-slate-800 tracking-tight">
                Transcription Data
              </h3>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${
                  !hasNumericErrors ? 'bg-mint-100 text-mint-700' : 'bg-rose-50 text-rose-500'
                }`}
              >
                {!hasNumericErrors ? 'Valid Data' : 'Incomplete Data'}
              </span>
            </div>
            <p className="text-[11px] font-medium text-slate-400 uppercase tracking-widest mt-0.5">
              Accurately transcribe prescription details
            </p>
          </div>
        </div>
      </div>

      <div className="p-5 bg-white space-y-5">
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <IoInformationCircleOutline className="text-amber-600" size={24} />
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-2">
              Business Rules: Valid Ranges
            </h4>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-amber-600 uppercase">SPH</p>
                <p className="text-xs font-semibold text-amber-900">-20.00 → +20.00</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-amber-600 uppercase">CYL</p>
                <p className="text-xs font-semibold text-amber-900">-20.00 → +20.00</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-amber-600 uppercase">AXIS</p>
                <p className="text-xs font-semibold text-amber-900">0 → 180</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-amber-600 uppercase">ADD</p>
                <p className="text-xs font-semibold text-amber-900">0.75 → 3.50</p>
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] font-bold text-amber-600 uppercase">PD</p>
                <p className="text-xs font-semibold text-amber-900">35 → 65</p>
              </div>
            </div>
          </div>
        </div>

        {warnings.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 shadow-sm border border-orange-200/50 text-orange-600">
              <IoWarningOutline size={24} />
            </div>
            <div className="flex-1">
              <h4 className="text-[10px] font-black text-orange-800 uppercase tracking-widest mb-2 flex items-center gap-2">
                Prescription Logic Warnings
                <span className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
              </h4>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-1.5">
                {warnings.map((w, i) => (
                  <li
                    key={i}
                    className="text-[11px] font-bold text-orange-700/80 flex items-start gap-2"
                  >
                    <span className="mt-1.5 w-1 h-1 rounded-full bg-orange-400/60 shrink-0" />
                    {w}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="bg-slate-50/40 p-5 rounded-xl border border-slate-100/60">
          <h4 className="font-semibold text-xs text-mint-600 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <IoEyeOutline size={16} className="text-mint-500" /> RIGHT EYE (OD)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                SPH
              </label>
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  value={parameters?.right?.SPH ?? '0.00'}
                  onChange={(e) => handleChange('right', 'SPH', e.target.value)}
                  onBlur={(e) => handleNumericBlur('right', 'SPH', e.target.value)}
                  className={`bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none${numericErrors['right_SPH'] ? ' border-red-400 bg-red-50/10' : ''}`}
                />
                {numericErrors['right_SPH'] && (
                  <p className="text-[10px] text-red-500 text-center mt-1 font-semibold animate-in fade-in duration-200">
                    {numericErrors['right_SPH']}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                CYL
              </label>
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  value={parameters?.right?.CYL ?? '0.00'}
                  onChange={(e) => handleChange('right', 'CYL', e.target.value)}
                  onBlur={(e) => handleNumericBlur('right', 'CYL', e.target.value)}
                  className={`bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none${numericErrors['right_CYL'] ? ' border-red-400 bg-red-50/10' : ''}`}
                />
                {numericErrors['right_CYL'] && (
                  <p className="text-[10px] text-red-500 text-center mt-1 font-semibold animate-in fade-in duration-200">
                    {numericErrors['right_CYL']}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                AXIS
              </label>
              <div className="relative">
                <Input
                  readOnly={isReadOnly || !isAxisRequired('right')}
                  value={parameters?.right?.AXIS ?? '0'}
                  onChange={(e) => handleChange('right', 'AXIS', e.target.value)}
                  onBlur={(e) => handleNumericBlur('right', 'AXIS', e.target.value)}
                  className={`bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none${numericErrors['right_AXIS'] ? ' border-red-400 bg-red-50/10' : ''} ${!isAxisRequired('right') ? 'opacity-40 cursor-not-allowed bg-slate-50' : ''}`}
                />
                {numericErrors['right_AXIS'] && (
                  <p className="text-[10px] text-red-500 text-center mt-1 font-semibold animate-in fade-in duration-200">
                    {numericErrors['right_AXIS']}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                ADD
              </label>
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  value={parameters?.right?.ADD ?? '0.00'}
                  onChange={(e) => handleChange('right', 'ADD', e.target.value)}
                  onBlur={(e) => handleNumericBlur('right', 'ADD', e.target.value)}
                  className={`bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none${numericErrors['right_ADD'] ? ' border-red-400 bg-red-50/10' : ''}`}
                />
                {numericErrors['right_ADD'] && (
                  <p className="text-[10px] text-red-500 text-center mt-1 font-semibold animate-in fade-in duration-200">
                    {numericErrors['right_ADD']}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="bg-slate-50/40 p-5 rounded-xl border border-slate-100/60">
          <h4 className="font-semibold text-xs text-mint-600 mb-4 flex items-center gap-2 uppercase tracking-[0.15em]">
            <IoEyeOutline size={16} className="text-mint-500" /> LEFT EYE (OS)
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                SPH
              </label>
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  value={parameters?.left?.SPH ?? '0.00'}
                  onChange={(e) => handleChange('left', 'SPH', e.target.value)}
                  onBlur={(e) => handleNumericBlur('left', 'SPH', e.target.value)}
                  className={`bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none${numericErrors['left_SPH'] ? ' border-red-400 bg-red-50/10' : ''}`}
                />
                {numericErrors['left_SPH'] && (
                  <p className="text-[10px] text-red-500 text-center mt-1 font-semibold animate-in fade-in duration-200">
                    {numericErrors['left_SPH']}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                CYL
              </label>
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  value={parameters?.left?.CYL ?? '0.00'}
                  onChange={(e) => handleChange('left', 'CYL', e.target.value)}
                  onBlur={(e) => handleNumericBlur('left', 'CYL', e.target.value)}
                  className={`bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none${numericErrors['left_CYL'] ? ' border-red-400 bg-red-50/10' : ''}`}
                />
                {numericErrors['left_CYL'] && (
                  <p className="text-[10px] text-red-500 text-center mt-1 font-semibold animate-in fade-in duration-200">
                    {numericErrors['left_CYL']}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                AXIS
              </label>
              <div className="relative">
                <Input
                  readOnly={isReadOnly || !isAxisRequired('left')}
                  value={parameters?.left?.AXIS ?? '0'}
                  onChange={(e) => handleChange('left', 'AXIS', e.target.value)}
                  onBlur={(e) => handleNumericBlur('left', 'AXIS', e.target.value)}
                  className={`bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none${numericErrors['left_AXIS'] ? ' border-red-400 bg-red-50/10' : ''} ${!isAxisRequired('left') ? 'opacity-40 cursor-not-allowed bg-slate-50' : ''}`}
                />
                {numericErrors['left_AXIS'] && (
                  <p className="text-[10px] text-red-500 text-center mt-1 font-semibold animate-in fade-in duration-200">
                    {numericErrors['left_AXIS']}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
                ADD
              </label>
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  value={parameters?.left?.ADD ?? '0.00'}
                  onChange={(e) => handleChange('left', 'ADD', e.target.value)}
                  onBlur={(e) => handleNumericBlur('left', 'ADD', e.target.value)}
                  className={`bg-white border-slate-200 focus:border-mint-500 focus:ring-mint-500/10 font-semibold text-slate-700 text-center h-12 rounded-xl text-sm transition-all shadow-none${numericErrors['left_ADD'] ? ' border-red-400 bg-red-50/10' : ''}`}
                />
                {numericErrors['left_ADD'] && (
                  <p className="text-[10px] text-red-500 text-center mt-1 font-semibold animate-in fade-in duration-200">
                    {numericErrors['left_ADD']}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start pt-2">
          <div className="space-y-3">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] block">
              PUPILLARY DISTANCE (PD)
            </label>
            <div className="grid grid-cols-1 gap-4">
              <div className="relative">
                <Input
                  readOnly={isReadOnly}
                  value={parameters?.PD ?? '64'}
                  onChange={(e) => handleChange('common', 'PD', e.target.value)}
                  onBlur={(e) => handleNumericBlur('common', 'PD', e.target.value)}
                  className={`font-semibold text-slate-700 text-center border-slate-200 h-12 rounded-xl focus:border-mint-500 focus:ring-mint-500/10 text-sm shadow-none${numericErrors['common_PD'] ? ' border-red-400' : ''}`}
                />
                {numericErrors['common_PD'] && (
                  <p className="text-[10px] text-red-500 text-center mt-1">
                    {numericErrors['common_PD']}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em] block">
                NOTES
              </label>
              {!isReadOnly && (
                <span
                  className={`text-[10px] font-medium ${(note ?? '').trim().length >= 10 ? 'text-mint-500' : 'text-slate-400'}`}
                >
                  {(note ?? '').trim().length}/10 min
                </span>
              )}
            </div>
            <textarea
              readOnly={isReadOnly}
              value={note ?? ''}
              onChange={(e) => onNoteChange?.(e.target.value)}
              onBlur={() => setNoteTouched(true)}
              className={`w-full h-16 p-3.5 rounded-xl border focus:outline-none focus:ring-2 focus:ring-mint-500/10 focus:border-mint-500 text-sm font-medium text-slate-700 resize-none bg-white transition-all placeholder:font-normal placeholder:text-slate-300 shadow-none overflow-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden ${
                noteError ? 'border-red-400 focus:border-red-400' : 'border-slate-200'
              }`}
              placeholder="Lab instructions... (min. 10 characters, no numbers only)"
            />
            {noteError && (
              <p className="text-[10px] text-red-500 font-medium flex items-center gap-1">
                <span>⚠</span> {noteError}
              </p>
            )}
          </div>
        </div>
      </div>

      {!isReadOnly && !isApproved && !isRejected && !isCanceled && (
        <div className="p-5 flex gap-4 border-t border-slate-100 bg-slate-50/20">
          <div className="flex flex-col gap-2 w-full">
            <Button
              isFullWidth
              onClick={handleApproveWithValidation}
              isLoading={processing}
              disabled={!isNoteValid || hasNumericErrors}
              className={`font-semibold h-12 rounded-xl text-sm transition-all active:scale-[0.98] border-none ${
                isNoteValid && !hasNumericErrors
                  ? 'bg-mint-600 hover:bg-mint-700 text-white shadow-md shadow-mint-100/30'
                  : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }`}
              leftIcon={<IoCheckmark size={20} />}
            >
              Verify &amp; Submit
            </Button>
          </div>
          <Button
            isFullWidth
            onClick={handleReject}
            isLoading={processing}
            variant="outline"
            colorScheme="neutral"
            className="bg-white border-slate-200 text-slate-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200 font-semibold h-12 rounded-xl text-sm transition-all active:scale-[0.98] shadow-none"
            leftIcon={<IoClose size={20} />}
          >
            Reject Order
          </Button>
        </div>
      )}

      {isApproved && (
        <div className="p-6 bg-white border-t border-neutral-50/50 text-slate-600">
          <div className="bg-neutral-50 border border-neutral-100 rounded-3xl p-8 transition-all duration-300">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-mint-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-mint-100">
                  <IoCheckmark size={32} className="text-white stroke-[3.5]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-mint-600 tracking-tight">
                    Verified and Approved
                  </h3>
                  {actionTime && (
                    <p className="text-[11px] text-slate-400 font-medium">
                      Processed on {actionTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 ml-[76px]">
                <div className="max-w-fit bg-white border border-neutral-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center border border-slate-100">
                    <IoPersonOutline className="text-slate-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase tracking-widest leading-none mb-1.5">
                      APPROVED BY
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {staffName || assignStaff || 'Sales Staff'}
                    </p>
                  </div>
                </div>

                {note && (
                  <div className="bg-white/90 border border-mint-100/60 rounded-2xl p-5 max-w-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="text-[10px] text-mint-600 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-mint-500" />
                      LAB INSTRUCTIONS
                    </p>
                    <div className="relative pl-4 border-l-2 border-mint-200">
                      <p className="text-sm text-slate-700 leading-relaxed font-semibold italic">
                        "{note}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {isRejected && (
        <div className="p-6 bg-white border-t border-rose-50/50">
          <div className="bg-rose-50/40 border border-rose-100 rounded-3xl p-8 transition-all duration-300">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-100">
                  <IoClose size={32} className="text-white stroke-[3.5]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-rose-600 tracking-tight">
                    Disputed and Rejected
                  </h3>
                  {actionTime && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      Rejected on {actionTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 ml-[76px]">
                <div className="max-w-fit bg-white border border-rose-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm hover:shadow-md transition-all">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                    <IoPersonOutline className="text-rose-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest leading-none mb-1.5">
                      SALES STAFF
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {staffName || assignStaff || 'Sales Staff'}
                    </p>
                  </div>
                </div>

                {(rejectionNote || (parameters as any).note) && (
                  <div className="bg-white/90 border border-rose-100/60 rounded-2xl p-5 max-w-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                      REJECTION NOTE
                    </p>
                    <div className="relative pl-4 border-l-2 border-rose-200">
                      <p className="text-sm text-slate-700 leading-relaxed font-semibold italic">
                        "{rejectionNote || (parameters as any).note}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {isCanceled && (
        <div className="p-6 bg-white border-t border-rose-50/50">
          <div className="bg-rose-50/40 border border-rose-100 rounded-3xl p-8 transition-all duration-300">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 rounded-2xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0 shadow-lg shadow-rose-100">
                  <IoClose size={32} className="text-white stroke-[3.5]" />
                </div>
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-rose-600 tracking-tight">Order Canceled</h3>
                  {actionTime && (
                    <p className="text-[11px] text-rose-400 font-medium">
                      Canceled on {actionTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex flex-col gap-4 ml-[76px]">
                <div className="max-w-fit bg-white border border-rose-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
                  <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100">
                    <IoPersonOutline className="text-rose-400" size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-rose-400 font-semibold uppercase tracking-widest leading-none mb-1.5">
                      CUSTOMER
                    </p>
                    <p className="text-sm font-semibold text-slate-800">
                      {canceledByName || 'Customer'}
                    </p>
                  </div>
                </div>

                {cancelNote && (
                  <div className="bg-white/90 border border-rose-100/60 rounded-2xl p-5 max-w-xl shadow-sm animate-in fade-in slide-in-from-top-2 duration-500">
                    <p className="text-[10px] text-rose-500 font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                      CUSTOMER NOTE
                    </p>
                    <div className="relative pl-4 border-l-2 border-rose-200">
                      <p className="text-sm text-slate-600 leading-relaxed font-semibold italic">
                        "{cancelNote}"
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
