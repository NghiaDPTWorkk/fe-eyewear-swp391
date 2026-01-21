import { Checkbox, FormField, Radio, RadioGroup, Select } from '@/shared/components'
import { useState } from 'react'

export default function TestSelection() {
  const [agree, setAgree] = useState(false)
  const [remember, setRemember] = useState(true)
  const [gender, setGender] = useState('male')
  const [payment, setPayment] = useState('momo')
  const [role, setRole] = useState('')
  const [category, setCategory] = useState('')

  return (
    <div className="flex flex-col gap-8 p-4">
      <Section title="Checkbox">
        <Checkbox
          isChecked={agree}
          onCheckedChange={setAgree}
          label="Tôi đồng ý điều khoản sử dụng"
        />
        <Checkbox isChecked={remember} onCheckedChange={setRemember} label="Ghi nhớ đăng nhập" />
        <Checkbox isDisabled label="Disabled unchecked" />
        <Checkbox isChecked isDisabled label="Disabled checked" />
      </Section>

      <Section title="Checkbox Sizes">
        <Checkbox isChecked size="sm" label="Small" />
        <Checkbox isChecked size="md" label="Medium" />
        <Checkbox isChecked size="lg" label="Large" />
      </Section>

      <Section title="Radio (Vertical)">
        <RadioGroup>
          <Radio
            name="gender"
            value="male"
            label="Nam"
            isChecked={gender === 'male'}
            onValueChange={setGender}
          />
          <Radio
            name="gender"
            value="female"
            label="Nữ"
            isChecked={gender === 'female'}
            onValueChange={setGender}
          />
          <Radio
            name="gender"
            value="other"
            label="Khác"
            isChecked={gender === 'other'}
            onValueChange={setGender}
          />
        </RadioGroup>
      </Section>

      <Section title="Radio (Horizontal)">
        <RadioGroup orientation="horizontal">
          <Radio
            name="payment"
            value="momo"
            label="MoMo"
            isChecked={payment === 'momo'}
            onValueChange={setPayment}
          />
          <Radio
            name="payment"
            value="vnpay"
            label="VNPay"
            isChecked={payment === 'vnpay'}
            onValueChange={setPayment}
          />
          <Radio
            name="payment"
            value="cod"
            label="COD"
            isChecked={payment === 'cod'}
            onValueChange={setPayment}
          />
        </RadioGroup>
      </Section>

      <Section title="Radio Disabled">
        <RadioGroup orientation="horizontal">
          <Radio name="status" value="active" label="Active" isChecked isDisabled />
          <Radio name="status" value="inactive" label="Inactive" isDisabled />
        </RadioGroup>
      </Section>

      <Section title="Select">
        <Select value={role} onChange={(e) => setRole(e.target.value)} placeholder="Chọn role">
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="customer">Customer</option>
        </Select>

        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Chọn danh mục"
          size="lg"
        >
          <option value="sunglasses">Kính râm</option>
          <option value="eyeglasses">Kính cận</option>
          <option value="lenses">Tròng kính</option>
        </Select>

        <Select isDisabled placeholder="Disabled">
          <option value="1">Option 1</option>
        </Select>

        <Select isInvalid placeholder="Invalid">
          <option value="1">Option 1</option>
        </Select>
      </Section>

      <Section title="Selection với FormField">
        <FormField label="Giới tính" fieldId="gender-field">
          <RadioGroup orientation="horizontal">
            <Radio
              name="gender-field"
              value="male"
              label="Nam"
              isChecked={gender === 'male'}
              onValueChange={setGender}
            />
            <Radio
              name="gender-field"
              value="female"
              label="Nữ"
              isChecked={gender === 'female'}
              onValueChange={setGender}
            />
          </RadioGroup>
        </FormField>

        <FormField label="Quốc gia" fieldId="country" isRequired>
          <Select id="country" placeholder="Chọn quốc gia">
            <option value="vn">Việt Nam</option>
            <option value="us">United States</option>
            <option value="jp">Japan</option>
          </Select>
        </FormField>

        <FormField label="Điều khoản" fieldId="terms">
          <Checkbox
            id="terms"
            isChecked={agree}
            onCheckedChange={setAgree}
            label="Tôi đồng ý với điều khoản dịch vụ"
          />
        </FormField>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 className="mb-3 text-lg font-medium text-neutral-700">{title}</h3>
      <div className="flex flex-col gap-2">{children}</div>
    </div>
  )
}
