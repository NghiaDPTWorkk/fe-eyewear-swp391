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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Checkbox */}
      <Section title="Checkbox">
        <Checkbox checked={agree} onChange={setAgree} label="Tôi đồng ý điều khoản sử dụng" />
        <Checkbox checked={remember} onChange={setRemember} label="Ghi nhớ đăng nhập" />
        <Checkbox disabled label="Disabled unchecked" />
        <Checkbox checked disabled label="Disabled checked" />
      </Section>

      <Section title="Checkbox Sizes">
        <Checkbox checked size="sm" label="Small" />
        <Checkbox checked size="md" label="Medium" />
        <Checkbox checked size="lg" label="Large" />
      </Section>

      {/* Radio */}
      <Section title="Radio (Vertical)">
        <RadioGroup>
          <Radio name="gender" value="male" label="Nam" checked={gender === 'male'} onChange={setGender} />
          <Radio name="gender" value="female" label="Nữ" checked={gender === 'female'} onChange={setGender} />
          <Radio name="gender" value="other" label="Khác" checked={gender === 'other'} onChange={setGender} />
        </RadioGroup>
      </Section>

      <Section title="Radio (Horizontal)">
        <RadioGroup orientation="horizontal">
          <Radio name="payment" value="momo" label="MoMo" checked={payment === 'momo'} onChange={setPayment} />
          <Radio name="payment" value="vnpay" label="VNPay" checked={payment === 'vnpay'} onChange={setPayment} />
          <Radio name="payment" value="cod" label="COD" checked={payment === 'cod'} onChange={setPayment} />
        </RadioGroup>
      </Section>

      <Section title="Radio Disabled">
        <RadioGroup orientation="horizontal">
          <Radio name="status" value="active" label="Active" checked disabled />
          <Radio name="status" value="inactive" label="Inactive" disabled />
        </RadioGroup>
      </Section>

      {/* Select */}
      <Section title="Select">
        <Select value={role} onChange={(e) => setRole(e.target.value)} placeholder="Chọn role">
          <option value="admin">Admin</option>
          <option value="staff">Staff</option>
          <option value="customer">Customer</option>
        </Select>

        <Select value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Chọn danh mục" size="lg">
          <option value="sunglasses">Kính râm</option>
          <option value="eyeglasses">Kính cận</option>
          <option value="lenses">Tròng kính</option>
        </Select>

        <Select disabled placeholder="Disabled">
          <option value="1">Option 1</option>
        </Select>

        <Select isInvalid placeholder="Invalid">
          <option value="1">Option 1</option>
        </Select>
      </Section>

      {/* With FormField */}
      <Section title="Selection với FormField">
        <FormField label="Giới tính" id="gender-field">
          <RadioGroup orientation="horizontal">
            <Radio name="gender-field" value="male" label="Nam" checked={gender === 'male'} onChange={setGender} />
            <Radio name="gender-field" value="female" label="Nữ" checked={gender === 'female'} onChange={setGender} />
          </RadioGroup>
        </FormField>

        <FormField label="Quốc gia" id="country" required>
          <Select id="country" placeholder="Chọn quốc gia">
            <option value="vn">Việt Nam</option>
            <option value="us">United States</option>
            <option value="jp">Japan</option>
          </Select>
        </FormField>

        <FormField label="Điều khoản" id="terms">
          <Checkbox id="terms" checked={agree} onChange={setAgree} label="Tôi đồng ý với điều khoản dịch vụ" />
        </FormField>
      </Section>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h3 style={{ marginBottom: '0.75rem', color: '#374151' }}>{title}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>{children}</div>
    </div>
  )
}
