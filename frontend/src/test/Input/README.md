# Input Components

## Import
```tsx
import { Input, Textarea, FormField } from '@/shared/components/ui'
```

---

# Input

## Props
| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Kích thước |
| `isInvalid` | `boolean` | `false` | Trạng thái lỗi |
| `isDisabled` | `boolean` | `false` | Disabled state |
| `leftElement` | `ReactNode` | - | Element bên trái |
| `rightElement` | `ReactNode` | - | Element bên phải |
| + tất cả props của `<input>` |

## Ví dụ
```tsx
// Cơ bản
<Input placeholder="Email" type="email" />

// Sizes
<Input size="sm" placeholder="Small" />
<Input size="lg" placeholder="Large" />

// Với icons
<Input leftElement={<SearchIcon />} placeholder="Tìm kiếm..." />
<Input rightElement={<EyeIcon />} type="password" />

// States
<Input isInvalid placeholder="Lỗi" />
<Input isDisabled placeholder="Disabled" />
```

---

# Textarea

## Props
| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Kích thước |
| `isInvalid` | `boolean` | `false` | Trạng thái lỗi |
| `isDisabled` | `boolean` | `false` | Disabled state |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Resize behavior |
| + tất cả props của `<textarea>` |

## Ví dụ
```tsx
// Cơ bản
<Textarea placeholder="Nhập mô tả..." />

// Sizes
<Textarea size="lg" placeholder="Large" />

// Resize
<Textarea resize="none" placeholder="Không resize" />
<Textarea resize="both" placeholder="Resize cả 2 chiều" />

// States
<Textarea isInvalid placeholder="Lỗi" />
<Textarea isDisabled placeholder="Disabled" />
```

---

# FormField

Wrapper component cho Input/Textarea với label, error, và helper text.
**Click label sẽ tự động focus vào input.**

## Props
| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `label` | `string` | **Required** | Label text |
| `fieldId` | `string` | auto | ID cho label htmlFor |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `isRequired` | `boolean` | `false` | Hiện dấu * |
| `children` | `ReactNode` | **Required** | Input/Textarea |

## Ví dụ
```tsx
// Cơ bản - truyền cùng fieldId cho FormField và id cho Input
<FormField label="Email" fieldId="email" isRequired>
  <Input type="email" id="email" placeholder="example@email.com" />
</FormField>

// Với error
<FormField label="Mật khẩu" fieldId="password" error="Mật khẩu phải có ít nhất 8 ký tự">
  <Input type="password" id="password" isInvalid />
</FormField>

// Với helper text
<FormField label="Mô tả" fieldId="desc" helperText="Tối đa 500 ký tự">
  <Textarea id="desc" />
</FormField>
```

## Lưu ý quan trọng
- **Phải truyền cùng `fieldId`** vào FormField và `id` vào Input để click label focus input
- Error và helperText không hiển thị cùng lúc (error ưu tiên)
