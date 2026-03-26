import { useParams, useNavigate } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import {
  IoArrowBackOutline,
  IoPersonOutline,
  IoMailOutline,
  IoShieldCheckmarkOutline,
  IoSaveOutline,
  IoCameraOutline,
  IoCallOutline,
  IoFingerPrintOutline,
  IoTimeOutline
} from 'react-icons/io5'
import { adminAccountService } from '@/shared/services/admin/adminAccountService'
import { Button, Container } from '@/shared/components/ui'
import { useState, useRef, useMemo } from 'react'

const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/

const validationSchema = Yup.object({
  name: Yup.string()
    .trim()
    .min(1)
    .max(255)
    .required('Full Name is required')
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
  password: Yup.string().min(8, 'Password must be at least 8 characters').optional(),
  role: Yup.string()
    .oneOf(['SALE_STAFF', 'OPERATION_STAFF', 'MANAGER', 'SYSTEM_ADMIN'])
    .required('Role is required'),
  avatar: Yup.string().trim().nullable()
})

export default function AdminEditStaffPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)

  const { data: staffData, isLoading, isError } = useQuery({
    queryKey: ['admin-staff-detail', id],
    queryFn: () => adminAccountService.getAdminAccountDetail(id!),
    enabled: !!id
  })

  const updateMutation = useMutation({
    mutationFn: (payload: any) => adminAccountService.updateAdminAccount(id!, payload),
    onSuccess: () => {
      toast.success('Staff profile updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-staff-accounts'] })
      queryClient.invalidateQueries({ queryKey: ['admin-staff-detail', id] })
      navigate('/admin/staff')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update staff')
    }
  })

  const staff = staffData?.data

  const initialValues = useMemo(() => {
    if (!staff) return {
      name: '',
      citizenId: '',
      phone: '',
      email: '',
      password: '',
      role: 'SALE_STAFF',
      avatar: ''
    }
    return {
      name: staff.name || '',
      citizenId: staff.citizenId || '',
      phone: staff.phone || '',
      email: staff.email || '',
      password: '',
      role: staff.role || 'SALE_STAFF',
      avatar: staff.avatar || ''
    }
  }, [staff])

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>, setFieldValue: any) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setAvatarPreview(result)
        setFieldValue('avatar', result) // In a real app, you'd upload the file to a CDN first
      }
      reader.readAsDataURL(file)
    }
  }

  if (isLoading) {
    return (
      <Container className="py-20 text-center">
        <div className="animate-pulse space-y-8">
          <div className="w-32 h-32 bg-neutral-100 rounded-full mx-auto" />
          <div className="h-8 bg-neutral-100 w-64 mx-auto rounded-xl" />
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="h-32 bg-neutral-50 rounded-3xl" />
            <div className="h-32 bg-neutral-50 rounded-3xl" />
          </div>
        </div>
      </Container>
    )
  }

  if (isError || !staff) {
    return (
      <Container className="py-20 text-center">
        <h2 className="text-2xl font-bold text-red-500">Error loading staff details</h2>
        <Button onClick={() => navigate('/admin/staff')} variant="outline" className="mt-6 rounded-2xl">
          Back to Staff List
        </Button>
      </Container>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50/50 pb-20">
      <div className="h-64 bg-gradient-to-br from-mint-500/10 via-sky-500/5 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 backdrop-blur-3xl opacity-30 pointer-events-none" />
        <Container className="h-full flex items-end pb-12">
          <div className="flex items-center gap-6 w-full">
            <button
              onClick={() => navigate('/admin/staff')}
              className="w-12 h-12 rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 flex items-center justify-center text-neutral-400 hover:text-mint-600 hover:scale-105 transition-all shadow-sm active:scale-95 group mb-4"
            >
              <IoArrowBackOutline size={20} className="group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <div className="mb-4">
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Edit Staff Profile</h1>
              <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest mt-1">Management Console</p>
            </div>
          </div>
        </Container>
      </div>

      <Container className="-mt-12">
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          enableReinitialize
          onSubmit={(values) => {
            const payload = { ...values }
            if (!payload.password) delete payload.password
            updateMutation.mutate(payload)
          }}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left: Avatar & Quick Info */}
              <div className="lg:col-span-1 space-y-8 animate-in slide-in-from-left duration-700">
                <div className="bg-white/80 backdrop-blur-2xl p-8 rounded-[40px] border border-white shadow-2xl shadow-neutral-200/50 flex flex-col items-center text-center">
                  <div className="relative group mb-6">
                    <div className="w-40 h-40 rounded-full bg-gradient-to-br from-mint-100 to-sky-100 p-1.5 shadow-inner">
                      <div className="w-full h-full rounded-full bg-white overflow-hidden border-4 border-white shadow-xl">
                        {(avatarPreview || values.avatar) ? (
                          <img 
                            src={avatarPreview || values.avatar} 
                            alt={values.name} 
                            className="w-full h-full object-cover transition-transform group-hover:scale-110 duration-500" 
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-200">
                            <IoPersonOutline size={64} />
                          </div>
                        )}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="absolute bottom-1 right-1 w-12 h-12 rounded-2xl bg-mint-600 text-white flex items-center justify-center shadow-lg shadow-mint-200 hover:bg-mint-700 hover:scale-110 active:scale-95 transition-all duration-300"
                    >
                      <IoCameraOutline size={22} />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleAvatarChange(e, setFieldValue)}
                    />
                  </div>

                  <div className="w-full space-y-2 mb-6">
                    <label className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-1">
                      Paste Avatar URL
                    </label>
                    <Field
                      name="avatar"
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-[11px] font-bold focus:outline-none focus:ring-4 focus:ring-mint-500/5 focus:border-mint-500 transition-all"
                    />
                  </div>
                  
                  <div className="space-y-1">
                    <h4 className="text-xl font-bold text-gray-900">{values.name || '---'}</h4>
                    <span className="inline-flex px-3 py-1 bg-mint-50 text-mint-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-mint-100">
                      {values.role?.replace('_', ' ') || 'Staff'}
                    </span>
                  </div>

                  <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-neutral-50">
                    <div className="text-left">
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <IoFingerPrintOutline className="text-sky-500" /> Account ID
                      </p>
                      <p className="text-[12px] font-bold text-gray-600 truncate">{staff._id}</p>
                    </div>
                    <div className="text-left">
                      <p className="text-[9px] font-bold text-neutral-400 uppercase tracking-widest mb-1 flex items-center gap-1">
                        <IoTimeOutline className="text-amber-500" /> Joined
                      </p>
                      <p className="text-[12px] font-bold text-gray-600">{staff.createdAt?.split(' ')[1]}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Form Details */}
              <div className="lg:col-span-2 space-y-8 animate-in slide-in-from-bottom duration-700 delay-100">
                <div className="bg-white/80 backdrop-blur-2xl p-10 rounded-[40px] border border-white shadow-2xl shadow-neutral-200/50 space-y-10">
                  {/* Personal Section */}
                  <section className="space-y-6">
                    <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-50 pb-4 flex items-center gap-2">
                      <IoPersonOutline className="text-mint-500" /> Personal Identity
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-1">Full Identity Name</label>
                        <Field
                          name="name"
                          className={`w-full px-5 py-4 bg-neutral-50/50 border rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/5 ${touched.name && errors.name ? 'border-red-400 bg-red-50/10' : 'border-neutral-100 focus:border-mint-500'}`}
                        />
                        <ErrorMessage name="name" component="p" className="text-[9px] font-bold text-red-500 px-1 pt-1" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-1">ID Number (Citizen ID)</label>
                        <Field
                          name="citizenId"
                          className={`w-full px-5 py-4 bg-neutral-50/50 border rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/5 ${touched.citizenId && errors.citizenId ? 'border-red-400 bg-red-50/10' : 'border-neutral-100 focus:border-mint-500'}`}
                        />
                        <ErrorMessage name="citizenId" component="p" className="text-[9px] font-bold text-red-500 px-1 pt-1" />
                      </div>
                    </div>
                  </section>

                  {/* Contact Section */}
                  <section className="space-y-6">
                    <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-50 pb-4 flex items-center gap-2">
                      <IoMailOutline className="text-sky-500" /> Communication Details
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-1 inline-flex items-center gap-1.5">
                          <IoMailOutline size={12} /> Email Address
                        </label>
                        <Field
                          name="email"
                          type="email"
                          className={`w-full px-5 py-4 bg-neutral-50/50 border rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/5 ${touched.email && errors.email ? 'border-red-400 bg-red-50/10' : 'border-neutral-100 focus:border-mint-500'}`}
                        />
                        <ErrorMessage name="email" component="p" className="text-[9px] font-bold text-red-500 px-1 pt-1" />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-1 inline-flex items-center gap-1.5">
                          <IoCallOutline size={12} /> Primary Phone
                        </label>
                        <Field
                          name="phone"
                          className={`w-full px-5 py-4 bg-neutral-50/50 border rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/5 ${touched.phone && errors.phone ? 'border-red-400 bg-red-50/10' : 'border-neutral-100 focus:border-mint-500'}`}
                        />
                        <ErrorMessage name="phone" component="p" className="text-[9px] font-bold text-red-500 px-1 pt-1" />
                      </div>
                    </div>
                  </section>

                  {/* Access Section */}
                  <section className="space-y-6">
                    <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-50 pb-4 flex items-center gap-2">
                      <IoShieldCheckmarkOutline className="text-indigo-500" /> Security & Access
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-1">Access Role Level</label>
                        <Field
                          as="select"
                          name="role"
                          className="w-full px-5 py-4 bg-neutral-50/50 border border-neutral-100 rounded-2xl text-sm font-bold text-gray-700 focus:outline-none focus:ring-4 focus:ring-mint-500/5 focus:border-mint-500 transition-all cursor-pointer"
                        >
                          <option value="SALE_STAFF">Sale Staff</option>
                          <option value="OPERATION_STAFF">Operation Staff</option>
                          <option value="MANAGER">Manager</option>
                          <option value="SYSTEM_ADMIN">System Admin</option>
                        </Field>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider px-1">Reset Password (Optional)</label>
                        <Field
                          name="password"
                          type="password"
                          placeholder="leave empty to keep current"
                          className={`w-full px-5 py-4 bg-neutral-50/50 border rounded-2xl text-sm font-bold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/5 ${touched.password && errors.password ? 'border-red-400 bg-red-50/10' : 'border-neutral-100 focus:border-mint-500'}`}
                        />
                        <ErrorMessage name="password" component="p" className="text-[9px] font-bold text-red-500 px-1 pt-1" />
                      </div>
                    </div>
                  </section>

                  {/* Static Buttons at the bottom */}
                  <div className="pt-10 flex flex-col sm:flex-row gap-4">
                    <Button
                      type="submit"
                      disabled={isSubmitting || updateMutation.isPending}
                      className="flex-1 py-5 h-auto rounded-[24px] text-base font-bold bg-mint-900 text-white shadow-2xl shadow-mint-200/50 hover:bg-mint-600 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <IoSaveOutline size={20} />
                      {isSubmitting ? 'Synchronizing...' : 'Save Profile Changes'}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate('/admin/staff')}
                      className="px-10 py-5 h-auto rounded-[24px] text-base font-bold border-neutral-200 text-neutral-500 hover:bg-neutral-50 hover:text-gray-900 transition-all"
                    >
                      Discard Changes
                    </Button>
                  </div>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Container>
    </div>
  )
}
