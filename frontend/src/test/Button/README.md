# Button Components

## Import
```tsx
import { Button, IconButton } from '@/shared/components/ui'
```

---

# Button

## Props
| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `variant` | `'solid' \| 'outline' \| 'ghost' \| 'link'` | `'solid'` | Kiểu hiển thị |
| `colorScheme` | `'primary' \| 'secondary' \| 'danger' \| 'neutral'` | `'primary'` | Màu sắc |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Kích thước |
| `leftIcon` | `ReactNode` | - | Icon bên trái |
| `rightIcon` | `ReactNode` | - | Icon bên phải |
| `isDisabled` | `boolean` | `false` | Disabled state |
| `isFullWidth` | `boolean` | `false` | Full width |
| `as` | `ElementType` | `'button'` | Render as element khác |

## Ví dụ sử dụng

### Cơ bản
```tsx
<Button>Click me</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="link">Link</Button>
```

### Color Schemes
```tsx
<Button colorScheme="primary">Primary</Button>
<Button colorScheme="secondary">Secondary</Button>
<Button colorScheme="danger">Danger</Button>
<Button colorScheme="neutral">Neutral</Button>
```

### Sizes
```tsx
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>
```

### Với Icons
```tsx
<Button leftIcon={<SearchIcon />}>Search</Button>
<Button rightIcon={<ArrowIcon />}>Next</Button>
```

### Polymorphic (as Link)
```tsx
<Button as="a" href="/about">About</Button>
<Button as={Link} to="/products">Products</Button>
```

### States
```tsx
<Button isDisabled>Disabled</Button>
<Button isFullWidth>Full Width</Button>
```

---

# IconButton

## Props
| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `icon` | `ReactNode` | **Required** | Icon hiển thị |
| `aria-label` | `string` | **Required** | Label cho accessibility |
| `variant` | `'solid' \| 'outline' \| 'ghost'` | `'ghost'` | Kiểu hiển thị |
| `colorScheme` | `'primary' \| 'secondary' \| 'danger' \| 'neutral'` | `'neutral'` | Màu sắc |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Kích thước |
| `isRound` | `boolean` | `false` | Bo tròn |
| `isDisabled` | `boolean` | `false` | Disabled state |
| `as` | `ElementType` | `'button'` | Render as element khác |

## Ví dụ sử dụng

### Cơ bản
```tsx
<IconButton icon={<SearchIcon />} aria-label="Search" />
<IconButton icon={<CartIcon />} aria-label="Cart" />
```

### Variants
```tsx
<IconButton icon={<HeartIcon />} aria-label="Like" variant="solid" colorScheme="danger" />
<IconButton icon={<HeartIcon />} aria-label="Like" variant="outline" colorScheme="danger" />
<IconButton icon={<HeartIcon />} aria-label="Like" variant="ghost" colorScheme="danger" />
```

### Round
```tsx
<IconButton icon={<HeartIcon />} aria-label="Like" variant="solid" colorScheme="danger" isRound />
```

### Sizes
```tsx
<IconButton icon={<SearchIcon />} aria-label="Search" size="sm" />
<IconButton icon={<SearchIcon />} aria-label="Search" size="md" />
<IconButton icon={<SearchIcon />} aria-label="Search" size="lg" />
```

## Khi nào dùng IconButton?
- Header icons (search, cart, user)
- Action buttons trong card/list
- Close buttons
- Navigation arrows
