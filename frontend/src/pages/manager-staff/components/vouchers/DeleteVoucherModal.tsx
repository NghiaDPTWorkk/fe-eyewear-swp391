import { createPortal } from 'react-dom'
import { IoTrashOutline } from 'react-icons/io5'

interface DeleteVoucherModalProps {
  isDeleting: boolean
  onCancel: () => void
  onConfirm: () => void
}

export function DeleteVoucherModal({ isDeleting, onCancel, onConfirm }: DeleteVoucherModalProps) {
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onCancel} />
      <div className="relative z-10 bg-white rounded-3xl shadow-2xl w-full max-w-sm p-8 text-center animate-in zoom-in duration-200">
        <div className="w-16 h-16 rounded-full bg-red-50 border border-red-100 flex items-center justify-center mx-auto mb-6 text-red-500">
          <IoTrashOutline size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">Delete Voucher?</h2>
        <p className="text-sm text-slate-500 mb-8 leading-relaxed">
          This action is permanent and cannot be undone. All assigned customers will lose this
          discount.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isDeleting}
            className="flex-1 py-3 h-12 rounded-xl border border-slate-200 text-slate-600 text-sm font-bold hover:bg-slate-50 transition active:scale-95 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeleting}
            className="flex-1 py-3 h-12 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 shadow-lg shadow-red-100 transition active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Deleting...
              </>
            ) : (
              'Confirm Delete'
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  )
}
