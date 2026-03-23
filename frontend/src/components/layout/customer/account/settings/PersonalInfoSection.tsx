import { Card, Input, Button } from '@/shared/components/ui'
import { User as UserIcon, Check, Mail, Phone } from 'lucide-react'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import type { User } from '@/shared/types'
import { useAuthStore } from '@/store'
import { toast } from 'react-hot-toast'
import { cn } from '@/shared/utils'

interface PersonalInfoSectionProps {
  user: User | null
}

export const PersonalInfoSection = ({ user }: PersonalInfoSectionProps) => {
  const { updateProfile } = useAuthStore()

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .required('Full name is required')
      .min(2, 'Full name must be at least 2 characters long')
      .matches(/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/, 'Name cannot contain special characters'),
    phone: Yup.string()
      .required('Phone number is required')
      .matches(/^[0-9]+$/, 'Phone must contain numbers only')
      .matches(/^(0|84)\d{8,9}$/, 'Invalid phone number format (9-10 digits)'),
    gender: Yup.string().required('Gender is required')
  })

  const formik = useFormik({
    initialValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      gender: (user?.gender as any) || 'N'
    },
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        await updateProfile(values)
        toast.success('Profile updated successfully!')
      } catch (error: any) {
        toast.error(error.response?.data?.message || 'Failed to update profile')
      }
    }
  })

  return (
    <Card className="p-10 !rounded-[24px] shadow-sm border-mint-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-mint-50 flex items-center justify-center text-primary-500 border border-mint-100 shadow-sm shadow-mint-50/50">
          <UserIcon size={20} />
        </div>
        <h3 className="text-xl font-bold text-mint-1200">Personal information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        {/* Full Name */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-mint-1100 ml-1">Full name *</label>
          <Input
            {...formik.getFieldProps('name')}
            placeholder="Enter your full name"
            className={cn(
              'bg-white border-mint-200 focus:border-primary-500 rounded-xl h-14',
              formik.touched.name && formik.errors.name && 'border-red-500'
            )}
            rightElement={
              formik.values.name &&
              !formik.errors.name && <Check className="w-5 h-5 text-primary-500 animate-in fade-in" />
            }
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-[11px] text-red-500 font-bold ml-1">{formik.errors.name}</p>
          )}
        </div>

        {/* Email - Read Only */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-mint-1100 ml-1">E-mail address</label>
          <Input
            value={user?.email || ''}
            isDisabled
            placeholder="Email address"
            className="bg-neutral-50 border-neutral-200 rounded-xl h-14 text-neutral-400 cursor-not-allowed"
            leftElement={<Mail size={18} className="text-neutral-300" />}
          />
          <p className="text-[10px] text-neutral-400 mt-1 ml-1">
            Email cannot be changed for security reasons.
          </p>
        </div>

        {/* Phone Number */}
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-mint-1100 ml-1">Phone number</label>
          <Input
            {...formik.getFieldProps('phone')}
            placeholder="Enter your phone number"
            className={cn(
              'bg-white border-mint-200 focus:border-primary-500 rounded-xl h-14',
              formik.touched.phone && formik.errors.phone && 'border-red-500'
            )}
            leftElement={<Phone size={18} className="text-mint-400" />}
            rightElement={
              formik.values.phone && !formik.errors.phone && <Check className="w-5 h-5 text-primary-500" />
            }
          />
          {formik.touched.phone && formik.errors.phone && (
            <p className="text-[11px] text-red-500 font-bold ml-1">{formik.errors.phone}</p>
          )}
        </div>

        {/* Gender Selection */}
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-semibold text-mint-1100 ml-1">Gender</label>
          <div className="flex flex-wrap gap-4 mt-1">
            {[
              { id: 'M', label: 'Male' },
              { id: 'F', label: 'Female' },
              { id: 'N', label: 'Other' }
            ].map((option) => (
              <label
                key={option.id}
                className={`flex-1 min-w-[100px] flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                  formik.values.gender === option.id
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-mint-100 bg-white text-mint-900 hover:border-mint-200'
                }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option.id}
                  checked={formik.values.gender === option.id}
                  onChange={() => formik.setFieldValue('gender', option.id)}
                  className="hidden"
                />
                <span className="font-bold text-sm tracking-wide">{option.label}</span>
                {formik.values.gender === option.id && <Check size={16} className="text-primary-500" />}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 pt-6 border-t border-mint-50">
        <Button
          onClick={() => formik.handleSubmit()}
          isLoading={formik.isSubmitting}
          isDisabled={!formik.isValid || !formik.dirty}
          className="bg-primary-500 hover:bg-primary-600 text-white px-10 h-14 rounded-xl font-bold uppercase tracking-widest text-sm shadow-xl shadow-primary-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
        >
          Save Changes
        </Button>
      </div>
    </Card>
  )
}
