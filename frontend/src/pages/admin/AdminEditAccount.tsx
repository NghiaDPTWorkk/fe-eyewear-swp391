import { useEffect } from 'react'
import ReactDOM from 'react-dom'
import { Form, Formik, type FormikHelpers } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/shared/components/ui'
import { IoCloseOutline } from 'react-icons/io5'

const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/
const CITIZEN_ID_REGEX = /^\d{12}$/

export interface CreateAdminAccountFormValues {
  name: string
  citizenId: string
  phone: string
  email: string
  password: string
  role: string
  avatar: string
}

export const createAdminAccountValidationSchema = Yup.object({
  name: Yup.string().trim().min(1).max(255).required('Name is required'),
  citizenId: Yup.string()
    .matches(CITIZEN_ID_REGEX, 'Citizen ID must be exactly 12 digits')
    .required('Citizen ID is required'),
  phone: Yup.string()
    .matches(VN_PHONE_REGEX, 'Invalid Vietnam phone number')
    .required('Phone is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  role: Yup.string()
    .oneOf(['SALE_STAFF', 'OPERATION_STAFF', 'MANAGER', 'SYSTEM_ADMIN'])
    .required('Role is required'),
  avatar: Yup.string().trim().nullable().defined()
})

interface AdminEditAccountProps {
  open: boolean
  onClose: () => void
  onSubmit: (
    values: CreateAdminAccountFormValues,
    helpers: FormikHelpers<CreateAdminAccountFormValues>
  ) => Promise<void>
  isSubmitting: boolean
}

const initialValues: CreateAdminAccountFormValues = {
  name: '',
  citizenId: '',
  phone: '',
  email: '',
  password: '',
  role: 'SALE_STAFF',
  avatar: ''
}

export function AdminEditAccount({ open, onClose, onSubmit, isSubmitting }: AdminEditAccountProps) {
  useEffect(() => {
    if (!open) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [open])

  if (!open) return null

  return ReactDOM.createPortal(
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          backgroundColor: 'rgba(0,0,0,0.5)',
          zIndex: 99999
        }}
      />
      <div
        style={{
          position: 'fixed',
          inset: 0,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '1rem',
          zIndex: 100000
        }}
      >
        <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl border border-neutral-100 shadow-2xl overflow-y-auto">
          <div className="p-6 border-b border-neutral-100 flex items-center justify-between sticky top-0 bg-white z-10">
            <h3 className="text-xl font-bold text-gray-900">Create Staff Account</h3>
            <button
              onClick={onClose}
              className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-gray-900"
            >
              <IoCloseOutline size={22} />
            </button>
          </div>

          <Formik<CreateAdminAccountFormValues>
            initialValues={initialValues}
            validationSchema={createAdminAccountValidationSchema}
            onSubmit={onSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur, setFieldValue }) => (
              <Form className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Name
                    </label>
                    <input
                      name="name"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="name"
                      maxLength={255}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    />
                    {touched.name && errors.name && (
                      <p className="mt-1 text-xs text-red-500">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Citizen ID
                    </label>
                    <input
                      name="citizenId"
                      value={values.citizenId}
                      onChange={(e) =>
                        setFieldValue('citizenId', e.target.value.replace(/\D/g, '').slice(0, 12))
                      }
                      onBlur={handleBlur}
                      autoComplete="off"
                      inputMode="numeric"
                      maxLength={12}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    />
                    {touched.citizenId && errors.citizenId && (
                      <p className="mt-1 text-xs text-red-500">{errors.citizenId}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Phone
                    </label>
                    <input
                      name="phone"
                      value={values.phone}
                      onChange={(e) =>
                        setFieldValue('phone', e.target.value.replace(/[^\d+]/g, '').slice(0, 12))
                      }
                      onBlur={handleBlur}
                      autoComplete="tel"
                      inputMode="tel"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    />
                    {touched.phone && errors.phone && (
                      <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Email
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="email"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    />
                    {touched.email && errors.email && (
                      <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Password
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="new-password"
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    />
                    {touched.password && errors.password && (
                      <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">
                      Role
                    </label>
                    <select
                      name="role"
                      value={values.role}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    >
                      <option value="SALE_STAFF">SALE_STAFF</option>
                      <option value="OPERATION_STAFF">OPERATION_STAFF</option>
                      <option value="MANAGER">MANAGER</option>
                      <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                    </select>
                    {touched.role && errors.role && (
                      <p className="mt-1 text-xs text-red-500">{errors.role}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-neutral-700 mb-2">
                    Avatar URL (optional)
                  </label>
                  <input
                    name="avatar"
                    value={values.avatar}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full px-4 py-3 border border-neutral-200 rounded-xl"
                    placeholder="https://..."
                  />
                </div>

                <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white pb-2">
                  <Button type="button" variant="outline" onClick={onClose} className="px-6">
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="solid"
                    colorScheme="primary"
                    disabled={isSubmitting}
                    className="px-6"
                  >
                    {isSubmitting ? 'Creating...' : 'Create Account'}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </>,
    document.body
  )
}
