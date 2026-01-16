# Eyewear Shop - E-commerce Platform

A modern full-stack e-commerce application for eyewear products built with React TypeScript (frontend) and Spring Boot (backend).

## Tech Stack

### Frontend

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 7
- **State Management:** Zustand 5
- **Server State:** TanStack Query 5
- **HTTP Client:** Axios
- **Routing:** React Router 7
- **Styling:** Tailwind CSS 4
- **Code Quality:** ESLint + Prettier + Husky

## Project Structure

```
Eyewear_Project/
├── frontend/          # React TypeScript frontend
├── backend/           # Spring Boot backend
└── docs/              # Project documentation
```

## Setup Instructions

### Prerequisites

- Node.js >= 18.x
- npm 9+
- Java 17+
- MySQL/PostgreSQL

### Installation

**Clone and navigate to project**

```bash
git clone <repository-url>
cd Eyewear_Project
```

**Install Frontend Dependencies**

```bash
cd frontend
npm install
```

**Configure Environment Variables**

Create `frontend/.env.local`:

```env
VITE_API_URL=http://localhost:8080/api
VITE_APP_NAME=Eyewear Shop
```

**Run Development Servers**

## Access

| Service     | URL                              |
| ----------- | -------------------------------- |
| Frontend    | http://localhost:5173            |
| Backend API | http://localhost:8080/api        |
| API Docs    | http://localhost:8080/swagger-ui |

## Features

- User Authentication (JWT)
- Product Catalog (Eyeglasses, Sunglasses, Lenses)
- Custom Prescription Lens Ordering
- Shopping Cart & Checkout
- Order Tracking
- Multi-role Dashboard (Customer, Staff, Operations, Manager, Admin)
- Payment Integration (MoMo, VNPay)
- Pre-order System

## Development

### Frontend Scripts

| Script                 | Description                |
| ---------------------- | -------------------------- |
| `npm run dev`          | Start dev server           |
| `npm run build`        | Build for production       |
| `npm run validate`     | Type-check + Lint + Format |
| `npm run validate:fix` | Auto-fix issues            |
| `npm run test`         | Run unit tests             |

### Git Commit Convention

**Format:** `KAN-XXX <type>: <description>`

```bash
git commit -m "KAN-123 feat: add product listing"
git commit -m "KAN-456 fix: resolve cart bug"
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

## User Roles

| Role           | Access                             |
| -------------- | ---------------------------------- |
| **Customer**   | Browse, purchase, track orders     |
| **Staff**      | Order management, customer support |
| **Operations** | Lab processing, QC, packing        |
| **Manager**    | Pricing, reports, policies         |
| **Admin**      | RBAC, system configuration         |

## Documentation

- [Developer Guide](./frontend/docs/DEVELOPER_GUIDE.md) - Development guidelines
- [Developer Handover](./frontend/docs/DEVELOPER_HANDOVER.md) - Complete documentation

## Contributing

1. Create a feature branch (`feat/feature-name`)
2. Make your changes
3. Run `npm run validate` before committing
4. Submit a pull request

## License

This project is developed for educational purposes as part of SWP391 course at FPT University.

---

**Team:** SWP391 - Semester 5

**Course:** Software Development Project

**University:** FPT University

Built with React, TypeScript
