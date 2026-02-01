import { Card, Checkbox } from '@/components'
import { Bell } from 'lucide-react'
import { useState } from 'react'

export const ContactPreferencesSection = () => {
  const [contactPrefs, setContactPrefs] = useState({
    promotions: true,
    texts: true
  })

  return (
    <Card className="p-10 !rounded-[24px]">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-500 border border-blue-100/50 shadow-sm shadow-blue-50/50">
          <Bell size={20} />
        </div>
        <h3 className="text-xl font-bold text-mint-1200">Contact preferences</h3>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex gap-4">
          <Checkbox
            isChecked={contactPrefs.promotions}
            onCheckedChange={(checked) =>
              setContactPrefs((prev) => ({ ...prev, promotions: checked }))
            }
            className="mt-1"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-mint-1200">
              Send me promotions and offers by email
            </span>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Sign up to receive news and exclusive offers from Glasses.com. You can withdraw
              consent at any time. For more details see our{' '}
              <a href="#" className="underline font-semibold">
                Privacy Policy
              </a>
              . I certify that I am 18 years or older.
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <Checkbox
            isChecked={contactPrefs.texts}
            onCheckedChange={(checked) => setContactPrefs((prev) => ({ ...prev, texts: checked }))}
            className="mt-1"
          />
          <div className="flex flex-col">
            <span className="font-semibold text-mint-1200">
              I would like to receive texts from Glasses.com
            </span>
            <p className="text-sm text-gray-500 mt-1 leading-relaxed">
              Yes, I agree to these terms. By checking the box I provide my signature expressly
              consenting to contact platform at the number I provided regarding products or
              services, including marketing and promotions, via live or automated text. I understand
              that I am not required to provide this consent.
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
