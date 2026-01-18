# Radio Component

Radio button component cho việc chọn một option trong một nhóm.

## Import

```tsx
import { Radio, RadioGroup } from '@/shared/components/ui'
```

## Cách sử dụng

### Cơ bản

```tsx
const [selected, setSelected] = useState('option1')

<RadioGroup>
  <Radio 
    name="options" 
    value="option1" 
    label="Option 1" 
    checked={selected === 'option1'} 
    onChange={setSelected} 
  />
  <Radio 
    name="options" 
    value="option2" 
    label="Option 2" 
    checked={selected === 'option2'} 
    onChange={setSelected} 
  />
</RadioGroup>
```

### Horizontal Layout

```tsx
<RadioGroup orientation="horizontal">
  <Radio name="payment" value="momo" label="MoMo" checked={payment === 'momo'} onChange={setPayment} />
  <Radio name="payment" value="vnpay" label="VNPay" checked={payment === 'vnpay'} onChange={setPayment} />
</RadioGroup>
```

### Disabled State

```tsx
<Radio name="status" value="active" label="Active" checked disabled />
<Radio name="status" value="inactive" label="Inactive" disabled />
```

## Props

### Radio

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `name` | `string` | required | Tên nhóm radio (HTML name attribute) |
| `value` | `string` | required | Giá trị của radio |
| `label` | `string` | required | Text hiển thị |
| `checked` | `boolean` | `false` | Trạng thái được chọn |
| `disabled` | `boolean` | `false` | Vô hiệu hóa radio |
| `onChange` | `(value: string) => void` | - | Callback khi chọn |

### RadioGroup

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `children` | `ReactNode` | required | Các Radio bên trong |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Hướng sắp xếp |

## CSS Classes

- `.radio` - Container chính
- `.radio--checked` - Khi được chọn
- `.radio--disabled` - Khi bị vô hiệu hóa
- `.radio__input` - Input ẩn
- `.radio__circle` - Vòng tròn bên ngoài
- `.radio__dot` - Chấm tròn bên trong
- `.radio__label` - Label text
- `.radio-group` - Container nhóm
- `.radio-group--vertical` - Layout dọc
- `.radio-group--horizontal` - Layout ngang
