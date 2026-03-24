import { Formik, Form, Field, ErrorMessage } from 'formik'
import * as Yup from 'yup'
import toast from 'react-hot-toast'
import PageHeader from '@/features/staff/components/common/PageHeader'
import { Container, Button, Card } from '@/shared/components/ui'
import {
  IoBusOutline,
  IoSettingsOutline,
  IoNotificationsOutline,
  IoSaveOutline,
  IoGlobeOutline,
  IoLockClosedOutline
} from 'react-icons/io5'
import { PATHS } from '@/routes/paths'

const validationSchema = Yup.object({
  defaultShippingFee: Yup.number()
    .min(0, 'Shipping fee cannot be negative')
    .required('Shipping fee is required'),
  systemName: Yup.string().required('System name is required'),
  contactEmail: Yup.string().email('Invalid email').required('Email is required')
})

export default function AdminSystemConfigPage() {
  const initialValues = {
    defaultShippingFee: 30000,
    systemName: 'OpticView Eyewear',
    contactEmail: 'admin@opticview.com'
  }

  const handleUpdateConfig = (values: typeof initialValues) => {
    console.log('Updating config:', values)
    toast.success('System configuration updated successfully')
  }

  return (
    <Container className="pt-2 pb-8 px-4 max-w-6xl space-y-8">
      <PageHeader
        title="System Configuration"
        subtitle="Manage global system parameters and default settings."
        breadcrumbs={[
          { label: 'Dashboard', path: PATHS.ADMIN.DASHBOARD },
          { label: 'System Config' }
        ]}
      />

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleUpdateConfig}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Navigation/Sections */}
            <div className="lg:col-span-1 space-y-4">
              <nav className="space-y-2">
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-mint-900 text-white shadow-lg shadow-mint-100/50 font-bold transition-all"
                >
                  <IoSettingsOutline size={20} />
                  General Settings
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-neutral-500 hover:bg-neutral-50 font-bold transition-all border border-neutral-100"
                >
                  <IoNotificationsOutline size={20} />
                  Notifications
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-neutral-500 hover:bg-neutral-50 font-bold transition-all border border-neutral-100"
                >
                  <IoGlobeOutline size={20} />
                  Localization
                </button>
                <button
                  type="button"
                  className="w-full flex items-center gap-3 px-6 py-4 rounded-2xl bg-white text-neutral-500 hover:bg-neutral-50 font-bold transition-all border border-neutral-100"
                >
                  <IoLockClosedOutline size={20} />
                  Security
                </button>
              </nav>

              <Card className="p-6 bg-indigo-50/50 border-indigo-100 border-dashed rounded-[24px]">
                <h5 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-2">
                  System Info
                </h5>
                <p className="text-xs text-indigo-700 font-medium leading-relaxed">
                  Last updated by Admin on March 23, 2024. All changes are logged for auditing
                  purposes.
                </p>
              </Card>
            </div>

            {/* Right Column: Settings Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Settings */}
              <Card className="rounded-[32px] border border-neutral-100 shadow-xl shadow-slate-200/40 p-8 bg-white space-y-8">
                <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-mint-50 text-mint-600 flex items-center justify-center">
                    <IoBusOutline size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-heading">
                      Shipping Settings
                    </h3>
                    <p className="text-xs font-medium text-neutral-400">
                      Configure default logistics parameters.
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider px-1">
                      Default Shipping Fee (₫)
                    </label>
                    <div className="relative group">
                      <Field
                        name="defaultShippingFee"
                        type="number"
                        className={`w-full pl-6 pr-16 py-4 bg-neutral-50 border rounded-3xl text-lg font-bold transition-all focus:outline-none focus:ring-4 focus:ring-mint-500/10 ${touched.defaultShippingFee && errors.defaultShippingFee ? 'border-red-500' : 'border-neutral-100 focus:border-mint-500'}`}
                        placeholder="30000"
                      />
                      <span className="absolute right-6 top-1/2 -translate-y-1/2 text-sm font-bold text-neutral-400 uppercase">
                        VND
                      </span>
                    </div>
                    <ErrorMessage
                      name="defaultShippingFee"
                      component="p"
                      className="text-[10px] font-bold text-red-500 px-1 pt-1"
                    />
                    <p className="text-[10px] text-neutral-400 font-medium px-1">
                      * This fee will be applied as default for all new orders across the system.
                    </p>
                  </div>
                </div>
              </Card>

              {/* General System Information */}
              <Card className="rounded-[32px] border border-neutral-100 shadow-xl shadow-slate-200/40 p-8 bg-white space-y-8">
                <div className="flex items-center gap-4 border-b border-neutral-50 pb-6">
                  <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center">
                    <IoSettingsOutline size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 font-heading">General Info</h3>
                    <p className="text-xs font-medium text-neutral-400">
                      Identify and main contact for the business.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase px-1">
                      System Display Name
                    </label>
                    <Field
                      name="systemName"
                      className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold transition-all focus:border-mint-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-neutral-500 uppercase px-1">
                      Contact Email
                    </label>
                    <Field
                      name="contactEmail"
                      type="email"
                      className="w-full px-6 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold transition-all focus:border-mint-500"
                    />
                  </div>
                </div>
              </Card>

              <div className="flex justify-end gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-10 h-14 rounded-2xl bg-mint-900 text-white font-bold shadow-xl shadow-mint-100/50 hover:bg-mint-700 transition-all flex items-center gap-2"
                >
                  <IoSaveOutline size={20} />
                  {isSubmitting ? 'Saving...' : 'Save Configuration'}
                </Button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </Container>
  )
}
