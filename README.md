# 🕶️ OpticEyewear Shop — E-commerce Platform

> **Live Website:** [https://eyewear-optic.shop](https://eyewear-optic.shop/)

OpticEyewear Shop is a full-stack e-commerce platform purpose-built for the eyewear industry. Developed as the capstone project for the **Software Development Project (SWP391)** course at **FPT University**, it delivers a premium shopping experience for customers alongside powerful multi-role management tools for staff and operators.

The project tackles the unique complexities of eyewear retail — custom prescriptions, diversified product lines (Eyeglasses, Sunglasses, Lenses), multi-step order fulfillment, and role-based administrative workflows.

---

## System Architecture

```
┌──────────────────┐       ┌────────────────────┐      ┌──────────────────────┐
│   Frontend Web   │       │   Backend Server    │      │      Database        │
│                  │◄─────►│                     │◄────►│                      │
│  React · Vite    │       │  Node.js · Express  │      │  MongoDB · Redis     │
│  TailwindCSS     │       │  NestJS-style       │      │                      │
│  TanStack Query  │       │                     │      │                      │
└──────────────────┘       └────────┬───────┬────┘      └──────────────────────┘
                                    │       │
                           ┌────────▼──┐ ┌──▼───────────────┐
                           │  Payment  │ │  Background Job   │
                           │  Service  │ │                   │
                           │           │ │  BullMQ           │
                           │  PayOS    │ │                   │
                           │  VNPay    │ └───────────────────┘
                           └───────────┘
                                           ┌───────────────────┐
                                           │   Mail Service    │
                                           │                   │
                                           │  Nodemailer       │
                                           │  Gmail SMTP       │
                                           └───────────────────┘
```

**Containerization:** Docker · Docker Compose

---

## Tech Stack

### Frontend

| Category            | Technology                                             |
| ------------------- | ------------------------------------------------------ |
| **Framework**       | React 19 + TypeScript 5.9                              |
| **Build Tool**      | Vite 7.2                                               |
| **State Management**| Zustand 5.0                                            |
| **Server State**    | TanStack React Query 5.90                              |
| **HTTP Client**     | Axios 1.13                                             |
| **Routing**         | React Router 7.12                                      |
| **Styling**         | Tailwind CSS 4.1                                       |
| **Form Handling**   | Formik + Yup                                           |
| **3D Visualization**| Three.js + React Three Fiber + Drei                    |
| **Real-time**       | Socket.IO Client                                       |
| **UI Components**   | Lucide React, React Icons, Splide Carousel             |
| **Code Quality**    | ESLint 9 + Prettier 3 + Husky 9 + Commitlint          |
| **Testing**         | Vitest 4.0 + React Testing Library                     |

### Backend

| Category            | Technology                                             |
| ------------------- | ------------------------------------------------------ |
| **Runtime**         | Node.js                                                |
| **Framework**       | Express.js                                             |
| **Database**        | MongoDB                                                |
| **Caching**         | Redis                                                  |
| **Job Queue**       | BullMQ                                                 |
| **Mail Service**    | Nodemailer + Gmail SMTP                                |
| **Payment**         | PayOS · VNPay                                          |
| **Auth**            | JWT + Google OAuth 2.0                                 |
| **Containerization**| Docker                                                 |

---

## Project Structure

```
fe-eyewear-swp391/
├── frontend/                    # React TypeScript SPA
│   ├── src/
│   │   ├── api/                 # API client, endpoints, HTTP interceptors
│   │   ├── assets/              # Static images and media
│   │   ├── components/          # Reusable UI components (layout/customer/staff/admin)
│   │   ├── context/             # React context providers
│   │   ├── features/            # Feature modules (auth, cart, sales, operations, manager)
│   │   ├── lib/                 # Utility libraries (cn, helpers)
│   │   ├── pages/               # Route-level page components
│   │   │   ├── auth/            # Login, Register pages
│   │   │   ├── customer/        # Home, Products, Cart, Checkout, Account
│   │   │   ├── admin/           # Admin dashboard & user management
│   │   │   ├── sales/           # Sale Staff order management
│   │   │   ├── operations/      # Operation Staff processing workflows
│   │   │   └── manager/         # Manager inventory, vouchers, reports
│   │   ├── routes/              # Route definitions, guards, path constants
│   │   ├── shared/              # Shared hooks, types, components, utils
│   │   ├── socket/              # Socket.IO client configuration
│   │   └── store/               # Zustand global stores
│   │       ├── auth.store.ts
│   │       ├── cart.store.ts
│   │       ├── wishlist.store.ts
│   │       ├── address.store.ts
│   │       ├── notification.store.ts
│   │       └── ...
│   ├── public/                  # Public static assets (banners, icons)
│   ├── scripts/                 # Validation & utility scripts
│   ├── Dockerfile               # Production container build
│   └── docker-compose.yml       # Container orchestration
└── README.md
```

---

## Features

### Customer Portal
- **Product Catalog** — Browse Eyeglasses, Sunglasses & Lenses with advanced filtering (category, gender, brand, price range)
- **3D Product Viewer** — Interactive Three.js-powered 3D model visualization for product immersion
- **Custom Prescriptions** — Multi-step prescription input flow with validation and saved prescriptions
- **Shopping Cart** — Optimistic UI updates with debounced backend sync for smooth experience
- **Wishlist** — Save favorite products for later
- **Online Checkout** — PayOS & VNPay payment integration with COD option
- **Order Tracking** — Real-time order status tracking
- **Account Management** — Addresses, prescriptions, order history, and profile settings
- **AI Chat** — Integrated AI conversation support
- **Forgot Password** — Email OTP-based password reset flow

### Sale Staff Dashboard
- Order management with prescription verification workflow
- Customer management and support tools
- Pre-order handling

### Operation Staff Dashboard
- Manufacturing process tracking
- Packing workflow management
- Delivery coordination and shipping code assignment
- Return ticket verification

### Manager Dashboard
- Product & inventory management with import/pre-order tracking
- Voucher creation and management
- Revenue reports and top-sales analytics
- Staff account management

### Admin Panel
- System-wide user management (customers & staff)
- Role-based access control (RBAC)
- AI conversation monitoring
- Support ticket & report management

---

## User Roles

| Role               | Responsibilities                                                                 |
| ------------------ | -------------------------------------------------------------------------------- |
| **Customer**       | Browse products, manage cart/wishlist, place orders, track shipments, manage Rx   |
| **Sale Staff**     | Order processing, prescription verification, customer support                    |
| **Operation Staff**| Lab manufacturing, QC, packing, delivery coordination                            |
| **Manager**        | Inventory management, vouchers, sales reports, staff oversight                    |
| **System Admin**   | System configuration, RBAC, AI monitoring, high-level management                 |

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9
- **Docker** (optional, for containerized deployment)

### Installation

```bash
# Clone the repository
git clone https://github.com/NghiaDPTWorkk/fe-eyewear-swp391.git
cd fe-eyewear-swp391

# Install frontend dependencies
cd frontend
npm install
```

### Environment Configuration

Create `frontend/.env.local`:

```env
VITE_API_URL=https://eyewear-backend.xyz
VITE_APP_NAME=Eyewear Shop
```

### Run Development Server

```bash
# Start with code validation
npm run dev

# Start without validation (faster)
npm run dev:skip
```

### Docker Deployment

```bash
docker-compose up -d --build
```

---

## Access Points

| Service          | URL                                     |
| ---------------- | --------------------------------------- |
| Live Demo | https://eyewear-optic.shop/            |
| Frontend (dev)   | http://localhost:3000                   |

---

## Development Scripts

| Script                 | Description                                    |
| ---------------------- | ---------------------------------------------- |
| `npm run dev`          | Validate code + start Vite dev server          |
| `npm run dev:skip`     | Start Vite dev server (skip validation)        |
| `npm run build`        | Validate + production build                    |
| `npm run validate`     | Run Type-check + Lint + Format checks          |
| `npm run validate:fix` | Auto-fix Lint/Format issues                    |
| `npm run test`         | Run unit tests (Vitest)                        |
| `npm run type-check`   | TypeScript type checking (no emit)             |
| `npm run format`       | Format all source files with Prettier          |

---

## Git Conventions

**Commit format:** `KAN-XXX <type>: <description>`

```bash
git commit -m "KAN-123 feat: add product listing page"
git commit -m "KAN-456 fix: resolve cart quantity jitter"
```

**Types:** `feat` · `fix` · `docs` · `style` · `refactor` · `perf` · `test` · `build` · `ci` · `chore` · `revert`

**Branch naming:** `feat/KAN-number` · `fix/KAN-number`

---

## Contributing

1. Create a feature branch (`feat/KAN-number`)
2. Make your changes
3. Run `npm run validate` before committing
4. Submit a pull request

---

## License

This project is developed for educational purposes as part of the **SWP391** course at **FPT University**.

---

**Team:** SWP391 — Semester 5 · FPT University

Built with using React, TypeScript, Express.js & MongoDB.
