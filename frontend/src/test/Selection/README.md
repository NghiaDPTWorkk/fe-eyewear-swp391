# Selection Components

## Import

```tsx
import { Checkbox, Radio, RadioGroup, Select } from '@/shared/components/ui'
```

---

# Checkbox

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `isChecked` | `boolean` | `false` | Trạng thái được chọn |
| `onCheckedChange` | `(checked: boolean) => void` | - | Callback khi thay đổi |
| `label` | `string` | - | Text hiển thị |
| `isDisabled` | `boolean` | `false` | Vô hiệu hóa |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Kích thước |

## Ví dụ

```tsx
const [agree, setAgree] = useState(false)

<Checkbox
  isChecked={agree}
  onCheckedChange={setAgree}
  label="Tôi đồng ý điều khoản"
/>

// Sizes
<Checkbox isChecked size="sm" label="Small" />
<Checkbox isChecked size="lg" label="Large" />

// Disabled
<Checkbox isDisabled label="Disabled" />
<Checkbox isChecked isDisabled label="Checked & Disabled" />
```

---

# Radio & RadioGroup

## Radio Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `name` | `string` | required | Tên nhóm radio |
| `value` | `string` | required | Giá trị của radio |
| `label` | `string` | required | Text hiển thị |
| `isChecked` | `boolean` | `false` | Trạng thái được chọn |
| `isDisabled` | `boolean` | `false` | Vô hiệu hóa |
| `onValueChange` | `(value: string) => void` | - | Callback khi chọn |

## RadioGroup Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `children` | `ReactNode` | required | Các Radio bên trong |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Hướng sắp xếp |

## Ví dụ

```tsx
const [gender, setGender] = useState('male')

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
</RadioGroup>

// Horizontal
<RadioGroup orientation="horizontal">
  <Radio name="payment" value="momo" label="MoMo" isChecked onValueChange={...} />
  <Radio name="payment" value="vnpay" label="VNPay" onValueChange={...} />
</RadioGroup>

// Disabled
<Radio name="status" value="active" label="Active" isChecked isDisabled />
```

---

# Select

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Kích thước |
| `isInvalid` | `boolean` | `false` | Trạng thái lỗi |
| `isDisabled` | `boolean` | `false` | Vô hiệu hóa |
| `placeholder` | `string` | - | Placeholder text |
| `children` | `ReactNode` | required | Các option |
| + tất cả props của `<select>` |

## Ví dụ

```tsx
const [role, setRole] = useState('')

<Select
  value={role}
  onChange={(e) => setRole(e.target.value)}
  placeholder="Chọn role"
>
  <option value="admin">Admin</option>
  <option value="staff">Staff</option>
</Select>

// Sizes
<Select size="sm" placeholder="Small">...</Select>
<Select size="lg" placeholder="Large">...</Select>

// States
<Select isInvalid placeholder="Invalid">...</Select>
<Select isDisabled placeholder="Disabled">...</Select>
```
