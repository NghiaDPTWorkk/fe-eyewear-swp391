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
| `leftElement` | `ReactNode` | - | Element bên trái |
| `rightElement` | `ReactNode` | - | Element bên phải |
| `disabled` | `boolean` | `false` | Disabled state |
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
<Input disabled placeholder="Disabled" />
```

---

# Textarea

## Props
| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Kích thước |
| `isInvalid` | `boolean` | `false` | Trạng thái lỗi |
| `resize` | `'none' \| 'vertical' \| 'horizontal' \| 'both'` | `'vertical'` | Resize behavior |
| `disabled` | `boolean` | `false` | Disabled state |
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
```

---

# FormField

Wrapper component cho Input/Textarea với label, error, và helper text.
**Click label sẽ tự động focus vào input.**

## Props
| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `label` | `string` | **Required** | Label text |
| `id` | `string` | auto | ID cho label htmlFor |
| `error` | `string` | - | Error message |
| `helperText` | `string` | - | Helper text |
| `required` | `boolean` | `false` | Hiện dấu * |
| `children` | `ReactNode` | **Required** | Input/Textarea |

## Ví dụ
```tsx
// Cơ bản - truyền cùng id cho FormField và Input
<FormField label="Email" id="email" required>
  <Input type="email" id="email" placeholder="example@email.com" />
</FormField>

// Với error
<FormField label="Mật khẩu" id="password" error="Mật khẩu phải có ít nhất 8 ký tự">
  <Input type="password" id="password" isInvalid />
</FormField>

// Với helper text
<FormField label="Mô tả" id="desc" helperText="Tối đa 500 ký tự">
  <Textarea id="desc" />
</FormField>
```

## Lưu ý quan trọng
- **Phải truyền cùng `id`** vào cả FormField và Input để click label focus input
- Error và helperText không hiển thị cùng lúc (error ưu tiên)
