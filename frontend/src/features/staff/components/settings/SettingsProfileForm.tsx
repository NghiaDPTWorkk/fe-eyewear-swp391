import { toast } from 'react-hot-toast'
import { IoShieldCheckmarkOutline, IoInformationCircleOutline } from 'react-icons/io5'
import { useFormik } from 'formik'
import * as Yup from 'yup'

import { useProfile } from '@/features/staff/hooks/useProfile'
import { profileService } from '@/features/staff/services/profile.service'
import { Card, Button } from '@/shared/components/ui-core'
import { cn } from '@/lib/utils'

/**
 * ProfileForm Component
 * Displays profile information and allows staff to request an update
 */
export default function ProfileForm() {
  const { data: profileData, isLoading, refetch } = useProfile()
  const profile = profileData?.data
  const staffRoles = ['SALE_STAFF', 'OPERATION_STAFF', 'MANAGER', 'ADMIN', 'SYSTEM_ADMIN']
  const isStaffRole = !!profile?.role && staffRoles.includes(profile.role)

  // Validation Schema with Yup
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Full Name is required')
      .min(2, 'Name must be at least 2 characters'),
    email: Yup.string().required('Email is required').email('Invalid email format'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^(0|84)\d{9,10}$/, 'Invalid phone number (should be 10-11 digits)')
  })

  // Formik configuration
  const formik = useFormik({
    initialValues: {
      name: profile?.name || '',
      email: profile?.email || '',
      phone: profile?.phone || ''
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      if (!isStaffRole) return

      try {
        const response = await profileService.requestProfileUpdate(values)
        if (response.success) {
          toast.success(response.message || 'Profile update request submitted for approval')
          refetch()
        } else {
          toast.error(response.message || 'Failed to submit request')
        }
      } catch (err: unknown) {
        const error = err as { response?: { data?: { message?: string } }; message?: string }
        toast.error(error.response?.data?.message || error.message || 'Something went wrong')
      }
    }
  })

  // Helper to format role names (e.g., OPERATION_STAFF -> Operation Staff)
  const formatRole = (roleName?: string) => {
    if (!roleName) return ''
    return roleName
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  if (isLoading) {
    return (
      <Card className="p-8 border-none shadow-sm shadow-neutral-200/50">
        <div className="animate-pulse space-y-8">
          <div className="h-7 w-48 bg-neutral-200 rounded-lg"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="space-y-3">
                <div className="h-3 w-20 bg-neutral-100 rounded"></div>
                <div className="h-12 w-full bg-neutral-50 rounded-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    )
  }

  return (
    <Card className="p-8 border-none shadow-sm shadow-neutral-200/50 bg-white">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-semibold text-slate-800 tracking-tight">
            Profile Information
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-1 uppercase tracking-widest">
            {isStaffRole ? 'Request changes to your profile' : 'View your profile details'}
          </p>
        </div>
        {isStaffRole && (
          <div className="flex items-center gap-2 text-[10px] font-semibold text-mint-600 bg-mint-50 px-3 py-1.5 rounded-full border border-mint-100 uppercase tracking-widest">
            <IoInformationCircleOutline size={14} /> Approval Required
          </div>
        )}
      </div>

      <form onSubmit={formik.handleSubmit} className="space-y-6">
        {/* Anti-autofill dummy fields */}
        <input type="text" style={{ display: 'none' }} aria-hidden="true" />
        <input type="email" style={{ display: 'none' }} aria-hidden="true" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">
              Full Name
            </label>
            <input
              type="text"
              {...formik.getFieldProps('name')}
              readOnly={!isStaffRole}
              className={cn(
                'w-full px-4 py-3 border rounded-xl text-sm font-semibold transition-all focus:outline-none',
                isStaffRole
                  ? 'bg-white border-slate-200 text-slate-700 focus:border-mint-500 focus:ring-4 focus:ring-mint-500/5 cursor-pointer'
                  : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed',
                formik.touched.name &&
                  formik.errors.name &&
                  'border-rose-500 focus:border-rose-500 focus:ring-rose-500/5'
              )}
            />
            {formik.touched.name && formik.errors.name && (
              <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {formik.errors.name}
              </p>
            )}
          </div>

          {/* Role (Read-only) */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">
              Role
            </label>
            <input
              type="text"
              value={formatRole(profile?.role)}
              readOnly
              className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl text-sm font-semibold text-slate-400 cursor-not-allowed focus:outline-none"
            />
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">
              Email
            </label>
            <input
              type="email"
              {...formik.getFieldProps('email')}
              readOnly={!isStaffRole}
              className={cn(
                'w-full px-4 py-3 border rounded-xl text-sm font-semibold transition-all focus:outline-none',
                isStaffRole
                  ? 'bg-white border-slate-200 text-slate-700 focus:border-mint-500 focus:ring-4 focus:ring-mint-500/5 cursor-pointer'
                  : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed',
                formik.touched.email &&
                  formik.errors.email &&
                  'border-rose-500 focus:border-rose-500 focus:ring-rose-500/5'
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {formik.errors.email}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest pl-1">
              Phone
            </label>
            <input
              type="text"
              {...formik.getFieldProps('phone')}
              readOnly={!isStaffRole}
              className={cn(
                'w-full px-4 py-3 border rounded-xl text-sm font-semibold transition-all focus:outline-none',
                isStaffRole
                  ? 'bg-white border-slate-200 text-slate-700 focus:border-mint-500 focus:ring-4 focus:ring-mint-500/5 cursor-pointer'
                  : 'bg-slate-50 border-slate-100 text-slate-400 cursor-not-allowed',
                formik.touched.phone &&
                  formik.errors.phone &&
                  'border-rose-500 focus:border-rose-500 focus:ring-rose-500/5'
              )}
            />
            {formik.touched.phone && formik.errors.phone && (
              <p className="text-[10px] text-rose-500 font-bold uppercase tracking-wide pl-1 animate-in fade-in slide-in-from-top-1 duration-200">
                {formik.errors.phone}
              </p>
            )}
          </div>
        </div>

        {isStaffRole && (
          <div className="flex justify-end pt-4">
            <Button
              type="submit"
              isLoading={formik.isSubmitting}
              isDisabled={!formik.isValid || !formik.dirty}
              className="h-11 rounded-xl font-semibold px-6 bg-mint-500 hover:bg-mint-600 shadow-md shadow-mint-100 transition-all active:scale-95 border-none disabled:bg-slate-100 disabled:text-slate-400 disabled:shadow-none"
              leftIcon={<IoShieldCheckmarkOutline size={18} />}
            >
              Submit Update Request
            </Button>
          </div>
        )}
      </form>
    </Card>
  )
}
