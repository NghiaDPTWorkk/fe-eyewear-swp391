import { Card, Input, Button } from '@/components'
import { User as UserIcon, Check, Calendar } from 'lucide-react'
import type { User } from '@/shared/types'

interface PersonalInfoSectionProps {
  user: User | null
}

export const PersonalInfoSection = ({ user }: PersonalInfoSectionProps) => {
  return (
    <Card className="p-10 !rounded-[24px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-mint-50 flex items-center justify-center text-primary-500 border border-mint-100 shadow-sm shadow-mint-50/50">
          <UserIcon size={20} />
        </div>
        <h3 className="text-xl font-bold text-mint-1200">Personal information</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        <div className="flex flex-col gap-2 md:col-span-2">
          <label className="text-sm font-medium text-gray-eyewear ml-1">Full name *</label>
          <Input
            key={user?.name}
            defaultValue={user?.name || ''}
            className="bg-white border-primary-500 rounded-xl h-14"
            rightElement={<Check className="w-5 h-5 text-primary-500" />}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-eyewear ml-1">E-mail *</label>
          <Input
            key={user?.email}
            defaultValue={user?.email || ''}
            className="bg-neutral-50 border-primary-500 rounded-xl h-14 text-gray-eyewear"
            rightElement={<Check className="w-5 h-5 text-primary-500" />}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-eyewear ml-1">Phone number</label>
          <Input
            key={user?.phone}
            defaultValue={user?.phone || ''}
            className="bg-white border-primary-500 rounded-xl h-14"
            rightElement={<Check className="w-5 h-5 text-primary-500" />}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-gray-eyewear ml-1">Date of birth</label>
          <Input
            defaultValue="01/05/2006"
            className="bg-white border-primary-500 rounded-xl h-14"
            rightElement={
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary-500" />
                <Calendar className="w-5 h-5 text-gray-eyewear" />
              </div>
            }
          />
          <p className="text-[11px] text-gray-400 mt-2 ml-1">
            We'll send you a special promo on your birthday!
          </p>
        </div>
      </div>

      <div className="mt-10">
        <Button className="bg-primary-500 hover:bg-primary-600 text-white px-8 h-12 rounded-lg font-bold uppercase tracking-wider text-sm shadow-md shadow-primary-100">
          Save Changes
        </Button>
      </div>
    </Card>
  )
}
