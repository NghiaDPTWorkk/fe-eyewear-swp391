import { Input, Textarea, FormField } from '@/shared/components/ui'

const SearchIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
)

const EyeIcon = () => (
  <svg
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
)

export default function TestInput() {
  return (
    <div className="flex flex-col gap-8 p-4">
      <Section title="Input Sizes">
        <Input size="sm" placeholder="Small" />
        <Input size="md" placeholder="Medium" />
        <Input size="lg" placeholder="Large" />
      </Section>

      <Section title="Input với Icons">
        <Input leftElement={<SearchIcon />} placeholder="Tìm kiếm..." />
        <Input rightElement={<EyeIcon />} type="password" placeholder="Mật khẩu" />
        <Input leftElement={<SearchIcon />} rightElement={<EyeIcon />} placeholder="Cả hai" />
      </Section>

      <Section title="Input States">
        <Input placeholder="Normal" />
        <Input isInvalid placeholder="Invalid" />
        <Input isDisabled placeholder="Disabled" />
      </Section>

      <Section title="Textarea">
        <Textarea placeholder="Nhập mô tả..." />
        <Textarea size="lg" placeholder="Large textarea" />
        <Textarea isInvalid placeholder="Invalid textarea" />
        <Textarea isDisabled placeholder="Disabled textarea" />
      </Section>

      <Section title="FormField">
        <FormField label="Email" fieldId="email" isRequired>
          <Input type="email" id="email" placeholder="example@email.com" />
        </FormField>

        <FormField label="Mật khẩu" fieldId="password" error="Mật khẩu phải có ít nhất 8 ký tự">
          <Input type="password" id="password" placeholder="Nhập mật khẩu" isInvalid />
        </FormField>

        <FormField label="Mô tả" fieldId="description" helperText="Tối đa 500 ký tự">
          <Textarea id="description" placeholder="Nhập mô tả sản phẩm..." />
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
