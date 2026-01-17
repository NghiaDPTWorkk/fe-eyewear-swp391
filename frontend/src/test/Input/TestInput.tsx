import { Input, Textarea, FormField } from '@/shared/components/ui'

const SearchIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const EyeIcon = () => (
  <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export default function TestInput() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Input cơ bản */}
      <Section title="Input Sizes">
        <Input size="sm" placeholder="Small" />
        <Input size="md" placeholder="Medium" />
        <Input size="lg" placeholder="Large" />
      </Section>

      {/* Input với icons */}
      <Section title="Input với Icons">
        <Input leftElement={<SearchIcon />} placeholder="Tìm kiếm..." />
        <Input rightElement={<EyeIcon />} type="password" placeholder="Mật khẩu" />
        <Input leftElement={<SearchIcon />} rightElement={<EyeIcon />} placeholder="Cả hai" />
      </Section>

      {/* Input states */}
      <Section title="Input States">
        <Input placeholder="Normal" />
        <Input isInvalid placeholder="Invalid" />
        <Input disabled placeholder="Disabled" />
      </Section>

      {/* Textarea */}
      <Section title="Textarea">
        <Textarea placeholder="Nhập mô tả..." />
        <Textarea size="lg" placeholder="Large textarea" />
        <Textarea isInvalid placeholder="Invalid textarea" />
      </Section>

      {/* FormField - Click label để focus */}
      <Section title="FormField (click label để focus)">
        <FormField label="Email" id="email" required>
          <Input type="email" id="email" placeholder="example@email.com" />
        </FormField>

        <FormField label="Mật khẩu" id="password" error="Mật khẩu phải có ít nhất 8 ký tự">
          <Input type="password" id="password" placeholder="Nhập mật khẩu" isInvalid />
        </FormField>

        <FormField label="Mô tả" id="description" helperText="Tối đa 500 ký tự">
          <Textarea id="description" placeholder="Nhập mô tả sản phẩm..." />
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
