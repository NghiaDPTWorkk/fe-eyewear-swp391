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
  IoSaveOutline
} from 'react-icons/io5'
import { customerService } from '@/shared/services/admin/customerService'
import { Button, Container } from '@/shared/components/ui'
import type { UpdateCustomerRequest } from '@/shared/types/customer.types'
import { Gender } from '@/shared/utils/enums/gender.enum'

const VN_PHONE_REGEX = /^(0|\+84)(3|5|7|8|9)\d{8}$/

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required').min(2, 'Name too short'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  phone: Yup.string().matches(VN_PHONE_REGEX, 'Invalid Vietnam phone number'),
  gender: Yup.string()
    .oneOf([Gender.MALE, Gender.FEMALE, Gender.NON_BINARY])
    .required('Gender is required'),
  isVerified: Yup.boolean()
})

export default function AdminEditUser() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const {
    data: userData,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['admin-customer', id],
    queryFn: () => customerService.getCustomerById(id!),
    enabled: !!id
  })

  const updateMutation = useMutation({
    mutationFn: (values: UpdateCustomerRequest) => customerService.updateCustomer(id!, values),
    onSuccess: () => {
      toast.success('User updated successfully')
      queryClient.invalidateQueries({ queryKey: ['admin-customers'] })
      queryClient.invalidateQueries({ queryKey: ['admin-customer', id] })
      navigate('/admin/users')
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to update user')
    }
  })

  if (isLoading) {
    return (
      <Container className="py-10 text-center">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-neutral-200 w-48 mx-auto rounded-lg"></div>
          <div className="h-64 bg-neutral-100 w-full max-w-2xl mx-auto rounded-3xl"></div>
        </div>
      </Container>
    )
  }

  if (isError || !userData?.data) {
    return (
      <Container className="py-10 text-center text-red-500">
        <p>Error loading user data. Please try again.</p>
        <Button onClick={() => navigate('/admin/users')} variant="outline" className="mt-4">
          Back to Users
        </Button>
      </Container>
    )
  }

  const customer = userData.data

  const initialValues: UpdateCustomerRequest = {
    name: customer.name || '',
    email: customer.email || '',
    phone: customer.phone || '',
    gender: customer.gender || Gender.NON_BINARY,
    isVerified: customer.isVerified ?? false
  }

  return (
    <Container className="py-8 max-w-4xl">
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin/users')}
            className="w-10 h-10 rounded-xl bg-white border border-neutral-100 flex items-center justify-center text-neutral-400 hover:text-gray-900 hover:border-neutral-200 transition-all shadow-sm"
          >
            <IoArrowBackOutline size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit User Profile</h1>
            <p className="text-xs font-medium text-neutral-400">
              Managing account for {customer.email}
            </p>
          </div>
        </div>
      </div>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => updateMutation.mutate(values)}
        enableReinitialize
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8 space-y-8">
              <section className="space-y-6">
                <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-50 pb-3 flex items-center gap-2">
                  <IoPersonOutline /> Basic Information
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase px-1">
                      Full Name
                    </label>
                    <Field
                      name="name"
                      className={`w-full px-4 py-3.5 bg-neutral-50 border rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-mint-500/10 transition-all ${touched.name && errors.name ? 'border-red-500' : 'border-neutral-100 focus:border-mint-500'}`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-[10px] font-bold text-red-500 px-1"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase px-1">
                      Gender
                    </label>
                    <Field
                      as="select"
                      name="gender"
                      className="w-full px-4 py-3.5 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold text-gray-700"
                    >
                      <option value={Gender.MALE}>Male</option>
                      <option value={Gender.FEMALE}>Female</option>
                      <option value={Gender.NON_BINARY}>Other</option>
                    </Field>
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-50 pb-3 flex items-center gap-2">
                  <IoMailOutline /> Contact Details
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase px-1">
                      Email Address
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className={`w-full px-4 py-3.5 bg-neutral-50 border rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-mint-500/10 transition-all ${touched.email && errors.email ? 'border-red-500' : 'border-neutral-100 focus:border-mint-500'}`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-[10px] font-bold text-red-500 px-1"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-neutral-500 uppercase px-1">
                      Phone Number
                    </label>
                    <Field
                      name="phone"
                      className={`w-full px-4 py-3.5 bg-neutral-50 border rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-mint-500/10 transition-all ${touched.phone && errors.phone ? 'border-red-500' : 'border-neutral-100 focus:border-mint-500'}`}
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-[10px] font-bold text-red-500 px-1"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-6">
                <h5 className="text-[11px] font-bold text-neutral-400 uppercase tracking-widest border-b border-neutral-50 pb-3 flex items-center gap-2">
                  <IoShieldCheckmarkOutline /> Account Settings
                </h5>
                <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-2xl border border-neutral-100 w-fit">
                  <Field
                    type="checkbox"
                    name="isVerified"
                    className="w-5 h-5 accent-mint-600 rounded-lg cursor-pointer"
                  />
                  <label className="text-sm font-bold text-gray-700 cursor-pointer">
                    Verified Account Status
                  </label>
                </div>
              </section>

              <div className="flex items-center justify-end gap-3 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/admin/users')}
                  className="px-8 rounded-2xl h-12 text-sm font-bold"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || updateMutation.isPending}
                  className="px-8 rounded-2xl h-12 text-sm font-bold bg-mint-900 text-white shadow-xl shadow-mint-100/50 hover:bg-mint-600 flex items-center gap-2"
                >
                  <IoSaveOutline size={18} />
                  {isSubmitting ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
