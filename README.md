# MenuX

A full-stack SaaS platform that lets business owners create and manage digital menus — shareable via a unique public link. Built for restaurants, cafés, gaming gear shops, and more.

## What It Does

MenuX allows business owners to:

- **Create a business profile** with name, description, logo, and a unique slug
- **Build a structured menu** with categories, items, prices, images, and food type tags
- **Drag-and-drop reorder** categories and items for full control over menu layout
- **Choose from menu templates** to style the public-facing menu page
- **Share a public menu link** (e.g. `/menu/my-cafe`) — no login required for viewers
- **Upload images** for logos and menu items (stored in Supabase Storage)
- **Manage food types / dietary tags** (e.g. Halal, Vegan, Spicy) per business

An **admin dashboard** provides super admins with the ability to manage all businesses, users, and platform-wide settings.

## Tech Stack

### Frontend

| Technology          | Purpose                                  |
| ------------------- | ---------------------------------------- |
| **React 19**        | UI framework                             |
| **TypeScript**      | Type safety                              |
| **Vite 7**          | Build tool & dev server                  |
| **React Router v7** | Client-side routing                      |
| **Tailwind CSS 4**  | Utility-first styling                    |
| **@dnd-kit**        | Drag-and-drop (category/item reordering) |
| **Lucide React**    | Icon library                             |
| **Supabase JS**     | Auth (Google OAuth + email/password)     |
| **Axios**           | HTTP client for API calls                |

### Backend

| Technology                                       | Purpose                              |
| ------------------------------------------------ | ------------------------------------ |
| **Express 5**                                    | REST API framework                   |
| **TypeScript**                                   | Type safety                          |
| **Supabase**                                     | Database (PostgreSQL), Auth, Storage |
| **JWT (jsonwebtoken)**                           | Token verification                   |
| **bcryptjs**                                     | Password hashing                     |
| **Multer**                                       | File upload handling                 |
| **Swagger (swagger-jsdoc + swagger-ui-express)** | API documentation                    |
| **Morgan**                                       | HTTP request logging                 |
| **express-validator**                            | Request validation                   |

### Infrastructure

| Technology                       | Purpose                                       |
| -------------------------------- | --------------------------------------------- |
| **Supabase (hosted PostgreSQL)** | Database with Row Level Security              |
| **Supabase Auth**                | Authentication (Google OAuth, email/password) |
| **Supabase Storage**             | Image/file storage (logos, menu item images)  |

## Project Structure

```
menux/
├── backend/
│   ├── src/
│   │   ├── index.ts                 # Express app entry point
│   │   ├── config/                  # Supabase client & Swagger config
│   │   ├── features/
│   │   │   ├── admin/               # Admin dashboard & user management
│   │   │   ├── auth/                # Authentication (login, signup, getMe)
│   │   │   ├── business/            # Business CRUD
│   │   │   ├── category/            # Category CRUD + reordering
│   │   │   ├── food-type/           # Food type tags (Halal, Vegan, etc.)
│   │   │   ├── item/                # Menu item CRUD + reordering
│   │   │   ├── menu/                # Public menu endpoint (by slug)
│   │   │   └── upload/              # Image upload (logos, item images)
│   │   ├── routes/                  # Central route registration
│   │   ├── scripts/                 # Utility & migration scripts
│   │   └── shared/
│   │       ├── middleware/           # Auth, error handling, security
│   │       ├── rbac/                # Role-based access control
│   │       ├── types/               # Shared TypeScript interfaces
│   │       └── utils/               # Helper utilities
│   └── supabase/
│       └── migrations/              # SQL migration files
├── frontend/
│   ├── src/
│   │   ├── App.tsx                  # Routes & providers
│   │   ├── features/
│   │   │   ├── admin/               # Admin dashboard pages
│   │   │   ├── auth/                # Login page & auth context
│   │   │   ├── business/            # Dashboard, create business, settings
│   │   │   ├── landing/             # Landing page
│   │   │   └── menu/                # Menu editor & public menu view
│   │   │       ├── components/      # CategoryModal, ItemModal, SortableCategory, etc.
│   │   │       ├── pages/           # MenuEditor, PublicMenu
│   │   │       ├── services/        # Menu API service layer
│   │   │       └── templates/       # Menu display templates
│   │   └── shared/
│   │       ├── components/          # Navbar, Footer, MainLayout, ThemeToggle
│   │       ├── contexts/            # ThemeContext (light/dark/system)
│   │       ├── hooks/               # usePermissions and other hooks
│   │       ├── rbac/                # Frontend permission checks
│   │       ├── types/               # Shared types
│   │       └── utils/               # API client, Supabase client
│   └── public/                      # Static assets
└── README.md
```

## Authorization & Roles

MenuX uses a custom **Role-Based Access Control (RBAC)** system with three roles:

| Role            | Description                                                         |
| --------------- | ------------------------------------------------------------------- |
| **user**        | Default role — can view public menus and manage own profile         |
| **admin**       | Business owner — full CRUD on own businesses, categories, and items |
| **super_admin** | Platform admin — full access to all resources + admin dashboard     |

Ownership-scoped permissions (`:own`) ensure admins can only modify their own businesses, while super admins bypass ownership checks.

## API Overview

All API routes are served under `/api/v1`. Swagger docs are available at `/api-docs`.

| Method | Endpoint                   | Auth        | Description                  |
| ------ | -------------------------- | ----------- | ---------------------------- |
| POST   | `/auth/login`              | No          | Login                        |
| GET    | `/auth/me`                 | Yes         | Get current user             |
| GET    | `/menu/:slug`              | No          | Public menu by business slug |
| POST   | `/business`                | Yes         | Create business              |
| GET    | `/business`                | Yes         | List businesses              |
| PUT    | `/business/:id`            | Yes         | Update business              |
| DELETE | `/business/:id`            | Yes         | Delete business              |
| POST   | `/business/:id/categories` | Yes         | Create category              |
| PUT    | `/categories/:id`          | Yes         | Update category              |
| POST   | `/categories/:id/items`    | Yes         | Create item                  |
| PUT    | `/items/:id`               | Yes         | Update item                  |
| POST   | `/upload/logo`             | Yes         | Upload business logo         |
| POST   | `/upload/image`            | Yes         | Upload item image            |
| GET    | `/admin/stats`             | Yes (admin) | Dashboard statistics         |
| GET    | `/admin/businesses`        | Yes (admin) | List all businesses          |
| GET    | `/admin/users`             | Yes (admin) | List all users               |

## Getting Started

### Prerequisites

- **Node.js** >= 18
- **npm** or **yarn**
- A **Supabase** project (for database, auth, and storage)

### Environment Variables

#### Backend (`backend/.env`)

```env
PORT=3000
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=http://localhost:5173
```

#### Frontend (`frontend/.env`)

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_API_URL=http://localhost:3000/api/v1
```

### Installation

```bash
# Clone the repo
git clone https://github.com/nithkidd/MenuX.git
cd MenuX

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### Database Setup

Run the SQL migration files in your Supabase SQL Editor in order:

1. `backend/supabase/migrations/001_initial_schema.sql`
2. `backend/supabase/migrations/002_storage_buckets.sql`
3. `backend/supabase/migrations/005_custom_users.sql`
4. `backend/supabase/migrations/007_add_user_roles.sql`
5. `backend/supabase/migrations/008_create_food_types.sql`
6. `backend/supabase/migrations/009_add_business_settings.sql`

### Running the App

```bash
# Start backend (from backend/)
npm run dev

# Start frontend (from frontend/)
npm run dev
```

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:3000
- **Swagger Docs:** http://localhost:3000/api-docs

## Key Features

- **Public Menu Pages** — Shareable link per business, no auth needed for viewers
- **Drag-and-Drop Ordering** — Reorder categories and items visually
- **Menu Templates** — Choose how the public menu looks
- **Image Uploads** — Business logos and item images via Supabase Storage
- **Dark Mode** — System-aware theme toggle (light / dark / system)
- **Food Type Tags** — Label items with dietary/type tags
- **RBAC** — Granular role-based permissions on both frontend and backend
- **Swagger API Docs** — Auto-generated from route annotations
- **Security Middleware** — Request sanitization and protection
- **Error Boundaries** — Graceful error handling on the frontend

## License

MIT License

Copyright (c) 2026 Sophanith Kosal (nithkidd)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Author:** Sophanith Kosal (nithkidd)  
**Website:** [https://kosalsophanith.dev/](https://kosalsophanith.dev/)
