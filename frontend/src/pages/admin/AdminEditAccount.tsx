import { useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import { Form, Formik, type FormikHelpers, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import { Button } from '@/shared/components/ui'
import {
  IoCloseOutline,
  IoPersonOutline,
  IoCallOutline,
  IoMailOutline,
  IoShieldCheckmarkOutline
} from 'react-icons/io5'
import type { StaffData } from './components/staff/StaffTable'

const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/

export interface CreateAdminAccountFormValues {
  name: string
  citizenId: string
  phone: string
  email: string
  password: string
  role: string
  avatar: string
}

export const adminAccountValidationSchema = (isEdit: boolean) =>
  Yup.object({
    name: Yup.string()
      .trim()
      .min(1)
      .max(255)
      .required('Name is required')
      .matches(/^[a-zA-ZÀ-Ỹà-ỹ\s]+$/, 'Name cannot contain special characters'),
    citizenId: Yup.string()
      .matches(/^\d+$/, 'Citizen ID must contain numbers only')
      .length(12, 'Citizen ID must be exactly 12 digits')
      .required('Citizen ID is required'),
    phone: Yup.string()
      .matches(/^[0-9]+$/, 'Phone must contain numbers only')
      .matches(VN_PHONE_REGEX, 'Invalid Vietnam phone number')
      .required('Phone is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: isEdit
      ? Yup.string().min(8, 'Password must be at least 8 characters').optional()
      : Yup.string()
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
  initialData?: StaffData | null
  onSubmit: (
    values: CreateAdminAccountFormValues,
    helpers: FormikHelpers<CreateAdminAccountFormValues>
  ) => Promise<void>
  isSubmitting: boolean
}

const blockNonDigits = (e: React.KeyboardEvent) => {
  if (
    !/[0-9]/.test(e.key) &&
    e.key !== 'Backspace' &&
    e.key !== 'Tab' &&
    e.key !== 'ArrowLeft' &&
    e.key !== 'ArrowRight' &&
    e.key !== 'Delete'
  ) {
    e.preventDefault()
  }
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

export function AdminEditAccount({
  open,
  onClose,
  initialData,
  onSubmit,
  isSubmitting
}: AdminEditAccountProps) {
  const isEdit = !!initialData
  const isCustomer = initialData?.role.toLowerCase() === 'customer'

  const formInitialValues = useMemo(() => {
    if (initialData) {
      return {
        name: initialData.name || '',
        citizenId: initialData.citizenId || '',
        phone: initialData.phone || '',
        email: initialData.email || '',
        password: '', // Keep empty for edit
        role: initialData.role.toUpperCase().replace(' ', '_'),
        avatar: initialData.avatar || ''
      }
    }
    return initialValues
  }, [initialData])

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
      {/* Background Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(8px)',
          zIndex: 999998
        }}
        className="animate-in fade-in duration-300"
      />

      {/* Centered Modal Container */}
      <div
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          maxHeight: '90vh',
          width: '95%',
          maxWidth: '640px',
          backgroundColor: 'white',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
          zIndex: 999999,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: '32px',
          overflow: 'hidden'
        }}
        className="animate-in zoom-in-95 fade-in duration-300"
      >
        <div className="p-6 border-b border-neutral-100 flex items-center justify-between bg-white sticky top-0 z-20">
          <div className="space-y-1">
            <h3 className="text-xl font-bold text-gray-900 font-heading">
              {isEdit
                ? isCustomer
                  ? 'Edit User Profile'
                  : 'Edit Staff Profile'
                : 'Create Staff Account'}
            </h3>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
              Please fill in the information properly
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-xl bg-neutral-50 flex items-center justify-center text-neutral-400 hover:text-gray-900 hover:bg-neutral-100 transition-all active:scale-95"
          >
            <IoCloseOutline size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-neutral-50/30">
          <Formik<CreateAdminAccountFormValues>
            initialValues={formInitialValues}
            validationSchema={adminAccountValidationSchema(isEdit)}
            enableReinitialize={true}
            onSubmit={onSubmit}
          >
            {({ values, errors, touched, handleChange, handleBlur }) => (
              <Form className="space-y-10">
                <div className="space-y-8">
                  <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
                    <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3 flex items-center gap-2">
                      Personal Information
                    </h5>
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2 px-1">
                          Avatar Profile
                        </label>
                        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                          <div className="w-16 h-16 rounded-2xl bg-neutral-100 border border-neutral-200 overflow-hidden flex-shrink-0">
                            {values.avatar ? (
                              <img
                                src={values.avatar}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-300">
                                <IoPersonOutline size={24} />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 space-y-2 w-full">
                            <input
                              name="avatar"
                              value={values.avatar}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              placeholder="Paste image URL here..."
                              className="w-full px-4 py-2 bg-neutral-50 border border-neutral-100 rounded-xl text-[12px] font-medium transition-all focus:outline-none focus:border-mint-500"
                            />
                            <p className="text-[10px] text-neutral-400 font-medium px-1">
                              Paste an external link or use the upload button in the profile page
                              after creation.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2 px-1">
                          <IoPersonOutline /> Full Name
                        </label>
                        <input
                          name="name"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3.5 bg-neutral-50 border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/10 ${touched.name && errors.name ? 'border-red-500' : 'border-neutral-100 focus:border-mint-500'}`}
                          placeholder="e.g. John Doe"
                        />
                        <ErrorMessage
                          name="name"
                          component="p"
                          className="text-[10px] font-bold text-red-500 px-1 pt-1"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2 px-1">
                            <IoCallOutline /> Phone Number
                          </label>
                          <input
                            name="phone"
                            value={values.phone}
                            onKeyDown={blockNonDigits}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3.5 bg-neutral-50 border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/10 ${touched.phone && errors.phone ? 'border-red-500' : 'border-neutral-100 focus:border-mint-500'}`}
                            placeholder="09xxx..."
                          />
                          <ErrorMessage
                            name="phone"
                            component="p"
                            className="text-[10px] font-bold text-red-500 px-1 pt-1"
                          />
                        </div>
                        {!isCustomer && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2 px-1">
                              <IoShieldCheckmarkOutline /> Citizen ID
                            </label>
                            <input
                              name="citizenId"
                              value={values.citizenId}
                              onKeyDown={blockNonDigits}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className={`w-full px-4 py-3.5 bg-neutral-50 border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/10 ${touched.citizenId && errors.citizenId ? 'border-red-500' : 'border-neutral-100 focus:border-mint-500'}`}
                              placeholder="12-digit number"
                            />
                            <ErrorMessage
                              name="citizenId"
                              component="p"
                              className="text-[10px] font-bold text-red-500 px-1 pt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm space-y-6">
                    <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-100 pb-3 flex items-center gap-2">
                      Security & Credentials
                    </h5>
                    <div className="space-y-5">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2 px-1">
                          <IoMailOutline /> Email Address
                        </label>
                        <input
                          name="email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className={`w-full px-4 py-3.5 bg-neutral-50 border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/10 ${touched.email && errors.email ? 'border-red-500' : 'border-neutral-100 focus:border-mint-500'}`}
                          placeholder="staff@example.com"
                        />
                        <ErrorMessage
                          name="email"
                          component="p"
                          className="text-[10px] font-bold text-red-500 px-1 pt-1"
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2 px-1">
                            {isEdit ? 'New Password' : 'Password'}
                          </label>
                          <input
                            name="password"
                            type="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-4 py-3.5 bg-neutral-50 border rounded-2xl text-sm font-semibold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/10 ${touched.password && errors.password ? 'border-red-500' : 'border-neutral-100 focus:border-mint-500'}`}
                            placeholder="********"
                          />
                          <ErrorMessage
                            name="password"
                            component="p"
                            className="text-[10px] font-bold text-red-500 px-1 pt-1"
                          />
                        </div>
                        {!isCustomer && (
                          <div className="space-y-1.5">
                            <label className="text-[10px] font-bold text-neutral-500 uppercase px-1">
                              Access Role
                            </label>
                            <select
                              name="role"
                              value={values.role}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold text-gray-700"
                            >
                              <option value="SALE_STAFF">SALE_STAFF</option>
                              <option value="OPERATION_STAFF">OPERATION_STAFF</option>
                              <option value="MANAGER">MANAGER</option>
                              <option value="SYSTEM_ADMIN">SYSTEM_ADMIN</option>
                            </select>
                            <ErrorMessage
                              name="role"
                              component="p"
                              className="text-[10px] font-bold text-red-500 px-1 pt-1"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-6 flex gap-3 mt-10">
                  <Button
                    type="submit"
                    variant="solid"
                    colorScheme="primary"
                    disabled={isSubmitting}
                    className="flex-1 py-4 h-auto text-sm font-bold shadow-xl shadow-mint-100/50 rounded-2xl"
                  >
                    {isSubmitting ? 'Processing...' : isEdit ? 'Update Profile' : 'Create Account'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="px-10 h-auto rounded-2xl text-sm font-bold"
                  >
                    Discard
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
