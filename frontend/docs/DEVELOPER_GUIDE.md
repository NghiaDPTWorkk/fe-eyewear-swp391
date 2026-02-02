# DEVELOPER GUIDE - Eyewear Project

> Hướng dẫn phát triển chi tiết cho team Frontend Developer

---

## CẤU TRÚC THƯ MỤC

```
src/
├── api/                      # API Layer
│   ├── apiClients.ts         # authClient, mainClient
│   └── endpoints.ts          # All API endpoints
│
├── lib/                      # Core Configuration
│   ├── axios.ts              # Axios factory + interceptors
│   └── react-query.ts        # QueryClient configuration
│
├── store/                    # Zustand Stores
│   ├── auth.store.ts         # Authentication state
│   └── cart.store.ts         # Shopping cart state
│
├── context/                  # Global Context Types
│   ├── AppContext.tsx        # App theme type definitions
│   └── index.ts              # Barrel export
│
├── shared/                   # Shared Resources
│   ├── components/ui/        # Button, Card
│   ├── constants/            # Messages, UserRole
│   ├── types/                # User, Product, Cart, API types
│   ├── hooks/                # useApiError
│   └── utils/                # Helper functions
│
├── features/                 # Feature Modules
│   └── [feature]/
│       ├── components/       # Feature-specific UI
│       ├── hooks/            # React Query hooks
│       ├── services/         # API calls
│       ├── types/            # Feature types
│       └── index.ts          # Barrel export
│
├── routes/                   # Router
│   ├── guards/               # AuthGuard, GuestGuard
│   └── index.tsx             # Router config (lazy loading)
│
├── pages/                    # Page Components
│   ├── auth/                 # LoginPage
│   ├── customer/             # HomePage
│   ├── LazyPage.tsx          # Lazy loading wrapper
│   └── NotFoundPage.tsx
│
└── components/               # Layout Components
    ├── layout/               # Header, Footer
    └── common/               # ProductCard
```

---

## LUỒNG XỬ LÝ

```
User Action → Router → Page → Feature Component → Hook → Service → API Client → Backend
                                                    ↓
                                              React Query Cache
                                                    ↓
                                               UI Updates
```

---

## API CLIENTS

| Client       | Base URL | Mô tả                                 |
| ------------ | -------- | ------------------------------------- |
| `authClient` | `/auth`  | Authentication APIs                   |
| `mainClient` | `/api`   | General APIs (products, orders, etc.) |

```typescript
// Import
import { authClient, mainClient } from '@/api'
import { ENDPOINTS } from '@/api'

// Usage
const response = await mainClient.get(ENDPOINTS.PRODUCTS.LIST)
```

---

## ️ ROUTE GUARDS

| Guard        | Mô tả             | Redirect   |
| ------------ | ----------------- | ---------- |
| `AuthGuard`  | Yêu cầu đăng nhập | → `/login` |
| `GuestGuard` | Chỉ cho guest     | → `/`      |

```typescript
import { AuthGuard, GuestGuard } from '@/routes/guards'

// Protected route
{ path: '/profile', element: <AuthGuard><ProfilePage /></AuthGuard> }

// Guest only route
{ path: '/login', element: <GuestGuard><LoginPage /></GuestGuard> }
```

---

## UI COMPONENT LIBRARY

### Available Components

```typescript
import {
  // Basic
  Button,
  Input,
  Card,
  Modal,
  ConfirmDialog,

  // Feedback
  Spinner,
  LoadingOverlay,
  Badge,
  OrderStatusBadge,

  // Loading States
  Skeleton,
  ProductCardSkeleton,

  // Error Handling
  ErrorBoundary,
  PageErrorBoundary
} from '@/shared/components/ui'
```

### Button Examples

```typescript
// Variants: primary, secondary, outline, ghost, danger
<Button variant="primary" size="lg">Submit</Button>
<Button variant="danger" isLoading={isPending}>Delete</Button>
<Button variant="outline" leftIcon={<Icon />}>With Icon</Button>
```

### Input Examples

```typescript
<Input
  label="Email"
  type="email"
  error={errors.email?.message}
  helperText="We'll never share your email"
/>
```

### Modal Examples

```typescript
<Modal
  isOpen={isOpen}
  onClose={handleClose}
  title="Confirm Order"
  footer={
    <>
      <Button variant="outline" onClick={handleClose}>Cancel</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
    </>
  }
>
  <p>Are you sure you want to place this order?</p>
</Modal>
```

---

## TẠO FEATURE MỚI

### Step 1: Types

```typescript
// features/product/types/product.types.ts
export interface Product {
  id: string
  name: string
  price: number
  description: string
  images: string[]
  category: string
  stock: number
}

export interface ProductFilters {
  category?: string
  minPrice?: number
  maxPrice?: number
  search?: string
}
```

### Step 2: Endpoint

```typescript
// api/endpoints.ts
PRODUCTS: {
  LIST: '/products',
  DETAIL: (id: string) => `/products/${id}`,
  SEARCH: '/products/search',
  CATEGORIES: '/products/categories'
}
```

### Step 3: Service

```typescript
// features/product/services/product.service.ts
import { mainClient, ENDPOINTS } from '@/api'
import type { Product, ProductFilters } from '../types'

export const productService = {
  getAll: (filters?: ProductFilters) =>
    mainClient.get<Product[]>(ENDPOINTS.PRODUCTS.LIST, { params: filters }),

  getById: (id: string) => mainClient.get<Product>(ENDPOINTS.PRODUCTS.DETAIL(id)),

  search: (query: string) =>
    mainClient.get<Product[]>(ENDPOINTS.PRODUCTS.SEARCH, { params: { q: query } })
}
```

### Step 4: Hook

```typescript
// features/product/hooks/useProducts.ts
import { useQuery } from '@tanstack/react-query'
import { productService } from '../services'
import type { ProductFilters } from '../types'

// Query Keys
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (filters: ProductFilters) => [...productKeys.lists(), filters] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const
}

// Hooks
export function useProducts(filters?: ProductFilters) {
  return useQuery({
    queryKey: productKeys.list(filters || {}),
    queryFn: () => productService.getAll(filters),
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export function useProduct(id: string) {
  return useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => productService.getById(id),
    enabled: !!id
  })
}
```

### Step 5: Component

```typescript
// features/product/components/ProductCard.tsx
import { Card, Button, Badge } from '@/shared/components/ui'
import type { Product } from '../types'

interface ProductCardProps {
  product: Product
  onAddToCart: (id: string) => void
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <Card variant="elevated" padding="none">
      <img src={product.images[0]} alt={product.name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="font-semibold">{product.name}</h3>
        <p className="text-lg font-bold text-blue-600">
          {product.price.toLocaleString()}đ
        </p>
        {product.stock === 0 && <Badge variant="danger">Hết hàng</Badge>}
        <Button
          fullWidth
          onClick={() => onAddToCart(product.id)}
          disabled={product.stock === 0}
        >
          Thêm vào giỏ
        </Button>
      </div>
    </Card>
  )
}
```

### Step 6: Page

```typescript
// pages/customer/ProductsPage.tsx
import { useProducts } from '@/features/product'
import { ProductCard, ProductCardSkeleton } from '@/features/product/components'
import { useCartStore } from '@/store'

export function ProductsPage() {
  const { data: products, isLoading, error } = useProducts()
  const addToCart = useCartStore(state => state.addItem)

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <ProductCardSkeleton key={i} />)}
      </div>
    )
  }

  if (error) return <ErrorFallback error={error} />

  return (
    <div className="grid grid-cols-3 gap-4">
      {products?.map(product => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={addToCart}
        />
      ))}
    </div>
  )
}
```

### Step 7: Register Route

```typescript
// routes/index.tsx
const ProductsPage = lazy(() => import('@/pages/customer/ProductsPage'))

// Add to router
{
  path: '/products',
  element: <LazyPage><ProductsPage /></LazyPage>
}
```

---

## CHECKLIST

```
□ 1. Define Types          → features/[name]/types/
□ 2. Add Endpoint          → api/endpoints.ts
□ 3. Create Service        → features/[name]/services/
□ 4. Create Hook           → features/[name]/hooks/
□ 5. Create Component      → features/[name]/components/
□ 6. Create Page           → pages/
□ 7. Register Route        → routes/index.tsx
□ 8. Add to barrel export  → features/[name]/index.ts
```

---

## KHÔNG LÀM

| Sai                      | Đúng                                             |
| ------------------------ | ------------------------------------------------ |
| Hardcode API URL         | Import từ `@/api`                                |
| Define types inline      | Import từ `@/shared/types` hoặc feature types    |
| Hardcode message         | Dùng `ERROR_MESSAGES` từ `@/shared/constants`    |
| Call API trong component | Qua Hook → Service → Client                      |
| Import cả thư viện       | Named import chỉ thứ cần dùng                    |
| `console.log`            | Dùng `console.warn`, `console.error` chỉ khi cần |
| Magic numbers/strings    | Định nghĩa constants                             |

---

## GIT COMMIT CONVENTION

```bash
# Format (JIRA ticket required)
<JIRA-ID> <type>: <subject>

# JIRA-ID Format
KAN-123    # Ticket number from JIRA board

# Types
feat:     # Tính năng mới
fix:      # Sửa bug
docs:     # Documentation
style:    # Format code (không thay đổi logic)
refactor: # Refactor code
test:     # Thêm tests
chore:    # Maintenance

# Examples
git commit -m "KAN-123 feat: add product listing page"
git commit -m "KAN-456 fix: resolve cart calculation bug"
git commit -m "KAN-789 refactor: move API logic to service"
```

---

## PATH ALIASES

```typescript
import { useAuth } from '@/features/auth'
import { UserRole } from '@/shared/types'
import { ERROR_MESSAGES } from '@/shared/constants'
import { useAuthStore } from '@/store'
import { apiClient, ENDPOINTS } from '@/api'
import { Button, Input, Modal } from '@/shared/components/ui'
```

---

## TÀI LIỆU LIÊN QUAN

- [DEVELOPER_HANDOVER.md](./DEVELOPER_HANDOVER.md) - Tài liệu bàn giao chi tiết
