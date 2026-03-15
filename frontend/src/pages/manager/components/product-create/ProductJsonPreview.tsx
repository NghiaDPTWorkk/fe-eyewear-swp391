import { IoCopyOutline } from 'react-icons/io5'

export function ProductJsonPreview({
  requestBody,
  validationErrors,
  onCopy
}: {
  requestBody: unknown
  validationErrors: string[]
  onCopy: () => void
}) {
  return (
    <div className="bg-white rounded-[32px] border border-neutral-100 shadow-sm overflow-hidden p-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div>
          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
            Request Body Preview
          </p>
          <p className="text-xs text-neutral-500 mt-1">
            Strict shape theo schema bạn đưa. Copy để dùng cho API sau.
          </p>
        </div>
        <button
          type="button"
          onClick={onCopy}
          className="flex items-center gap-2 px-4 py-2 rounded-xl border border-neutral-200 text-gray-700 text-xs font-bold hover:bg-neutral-50 transition-all"
        >
          <IoCopyOutline size={16} />
          Copy JSON
        </button>
      </div>

      {validationErrors.length ? (
        <div className="mb-4 p-4 rounded-2xl border border-red-100 bg-red-50">
          <p className="text-xs font-extrabold text-red-700 mb-2">Validation</p>
          <div className="space-y-1">
            {validationErrors.map((e) => (
              <p key={e} className="text-xs font-semibold text-red-600">
                {e}
              </p>
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-4 p-4 rounded-2xl border border-mint-100 bg-mint-50">
          <p className="text-xs font-extrabold text-mint-700">Looks good</p>
          <p className="text-xs font-semibold text-mint-600 mt-1">
            (Chưa gọi API, chỉ đảm bảo shape + invariant chính)
          </p>
        </div>
      )}

      <pre className="text-[12px] leading-5 whitespace-pre-wrap break-words bg-neutral-50 border border-neutral-100 rounded-2xl p-4 overflow-auto max-h-[70vh]">
        {JSON.stringify(requestBody, null, 2)}
      </pre>
    </div>
  )
}
