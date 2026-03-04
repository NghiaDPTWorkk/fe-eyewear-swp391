# OpticEyewear Shop - E-commerce Platform
  Live Website: https://eyewear-optic.shop/
OpticEyewear Shop is a high-performance, full-stack e-commerce platform specifically designed for the eyewear industry. Developed as a core project for the Software Development Project (SWP391) course at FPT University, this application provides a seamless shopping experience for customers while offering robust management tools for staff and operators.

The project focuses on solving the complexities of eyewear retail, such as managing custom prescriptions, diverse product variations (Eyeglasses, Sunglasses, Lenses), and a multi-role administrative workflow.

## Tech Stack

### Frontend

- **Framework:** React 19.2 + TypeScript 5.9
- **Build Tool:** Vite 7.2
- **State Management:** Zustand 5.0
- **Server State:** TanStack Query 5.90
- **HTTP Client:** Axios 1.13
- **Routing:** React Router 7.12
- **Styling:** Tailwind CSS 4.1
- **Code Quality:** ESLint 9 + Prettier 3 + Husky 9
- **Testing:** Vitest 4.0

## Project Structure

```
Eyewear_Project/
├── frontend/          # React TypeScript frontend
│   ├── src/           # Application source code
│   ├── public/        # Static assets
│   ├── docs/          # Frontend documentation
│   └── scripts/       # Validation and utility scripts
├── backend/           # Spring Boot backend (In Development)
└── docs/              # General project documentation
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

Create `frontend/.env.local` (or use `.env`):

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME=Eyewear Shop
```

*Note: In development, the Vite server is configured to proxy `/api` requests to the backend.*

**Run Development Servers**

```bash
# Start frontend
npm run dev
# Or skip validation
npm run dev:skip
```

## Access

| Service     | URL                              |
| ----------- | -------------------------------- |
| **Live Demo** | **https://eyewear-optic.shop/** |
| Frontend    | http://localhost:3000            |
| Backend API | http://localhost:8080/api/v1     |
| API Docs    | http://localhost:8080/swagger-ui |

*Note: Frontend port is set to 3000 in `vite.config.ts`.*

## Features

- **User Authentication:** JWT-based secure authentication for customers and staff.
- **Product Catalog:** Detailed listing for Eyeglasses, Sunglasses, and Lenses.
- **Custom Prescriptions:** Specialized ordering flow for prescription lenses.
- **Shopping Cart & Checkout:** Seamless experience with persistent cart.
- **Order Tracking:** Real-time tracking for customers.
- **Multi-role Dashboards:** Specialized interfaces for Sale Staff, Operations, and Managers.
- **Payment Integration:** Supports COD and ZaloPay (with MOMO/VNPAY support in types).
- **Pre-order System:** Ability to order upcoming or out-of-stock products.
- **Inventory Management:** Full control over products and stock for managers.

## Development

### Frontend Scripts

| Script                 | Description                                  |
| ---------------------- | -------------------------------------------- |
| `npm run dev`          | Validate code and start Vite dev server      |
| `npm run dev:skip`     | Start Vite dev server without validation     |
| `npm run build`        | Validate and build for production            |
| `npm run validate`     | Run Type-check + Lint + Format checks        |
| `npm run validate:fix` | Automatically fix Lint/Format issues         |
| `npm run test`         | Run unit tests using Vitest                  |
| `npm run type-check`   | Run TypeScript compiler without emitting files |

### Git Commit Convention

**Format:** `KAN-XXX <type>: <description>`

```bash
git commit -m "KAN-123 feat: add product listing"
git commit -m "KAN-456 fix: resolve cart bug"
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `build`, `ci`, `chore`, `revert`

## User Roles

| Role           | Access                                                                 |
| -------------- | ---------------------------------------------------------------------- |
| **Customer**   | Browse products, manage cart, place orders, track shipments            |
| **Sale Staff** | Order management, prescription verification, customer support          |
| **Operations** | Lab processing, QC, packing workflow, order fulfillment                |
| **Manager**    | Inventory management, sales reports, transaction history, settings     |
| **Admin**      | System configuration, RBAC, and high-level management (WIP)            |

## Documentation

- [Developer Guide](./frontend/docs/DEVELOPER_GUIDE.md) - Frontend development guidelines
- [Developer Handover](./frontend/docs/DEVELOPER_HANDOVER.md) - Specialized documentation for handovers
- [Types Documentation](./frontend/docs/TYPES_DOCUMENTATION.md) - Comprehensive guide to the type system

## Contributing

1. Create a feature branch (`feat/KAN-number`)
2. Make your changes
3. Run `npm run validate` before committing
4. Submit a pull request

## License

This project is developed for educational purposes as part of the SWP391 course at FPT University.

---

**Team:** SWP391 - Semester 5

**Course:** Software Development Project

**University:** FPT University

Built with React, TypeScript, and Spring Boot

