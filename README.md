# InvoiceFlow

A calm, beautiful invoicing platform for small businesses and freelancers. Built with Next.js 15, NextAuth.js v5, Prisma + SQLite, and Tailwind CSS.

## Features

- **User Authentication** - Secure sign-up and login with NextAuth.js v5 (Credentials provider)
- **Dashboard** - Overview of revenue, invoice counts, and recent invoices
- **Invoice Management** - Create, view, and track invoices with line items
- **Client Management** - Store client details and view their invoice history
- **Payment Tracking** - Track invoice status (Draft, Sent, Paid, Overdue)
- **PDF Generation** - Download invoices as PDF files
- **Calm UI** - Soothing color palette with sky blue, mint, sand, and soft white

## Tech Stack

### Frontend (Next.js 15)
- **Framework**: Next.js 15 (App Router)
- **Authentication**: NextAuth.js v5 (`next-auth@beta`)
- **Styling**: Tailwind CSS with custom "Calm System" palette
  - Sky Blue: `#87CEEB`
  - Mint: `#98FB98`
  - Sand: `#F4A460`
  - Soft White: `#FAFAF0`
- **Fonts**: Geist (sans), Lora (serif)
- **ORM**: Prisma + SQLite (development)
- **Forms**: React Hook Form with Zod validation
- **PDF**: jsPDF + jsPDF-autoTable

### Backend (Python FastAPI)
- **Framework**: FastAPI
- **Server**: Uvicorn
- **Database**: SQLite (shared with frontend for development)

## Prerequisites

- Node.js 18+ and npm
- Python 3.9+ and pip

## Getting Started

### 1. Clone the repository
```bash
git clone <repo-url>
cd invoiceflow-ce3408
```

### 2. Set up the Frontend (Next.js)

```bash
cd frontend
npm install
```

Create `frontend/.env.local`:
```env
NEXTAUTH_SECRET=your-secret-key-here-change-in-production
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

Initialize the database:
```bash
npx prisma migrate dev --name init
npx prisma generate
```

Start the development server:
```bash
npm run dev
```

The frontend runs at `http://localhost:3000`

### 3. Set up the Backend (FastAPI)

```bash
cd backend
pip install -r requirements.txt
```

Start the backend server:
```bash
python main.py
```

The backend runs at `http://localhost:8000`

## Project Structure

```
invoiceflow-ce3408/
├── frontend/                    # Next.js 15 frontend
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── [...nextauth]/route.ts  # NextAuth v5 route
│   │   │   │   └── signup/route.ts         # User registration
│   │   │   ├── invoices/route.ts            # Invoice API
│   │   │   └── clients/route.ts             # Client API
│   │   ├── dashboard/page.tsx               # Main dashboard
│   │   ├── invoices/
│   │   │   ├── page.tsx                     # Invoice list
│   │   │   ├── new/page.tsx                 # Create invoice
│   │   │   └── [id]/page.tsx                # Invoice detail
│   │   ├── clients/
│   │   │   ├── page.tsx                     # Client list
│   │   │   └── new/page.tsx                 # Add client
│   │   ├── login/page.tsx                   # Login page
│   │   ├── signup/page.tsx                  # Signup page
│   │   ├── page.tsx                         # Landing page
│   │   ├── layout.tsx                       # Root layout
│   │   └── globals.css                      # Global styles
│   ├── prisma/
│   │   └── schema.prisma                    # Database schema
│   ├── middleware.ts                         # Auth middleware
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                       # FastAPI backend
│   ├── main.py                    # FastAPI application
│   └── requirements.txt
│
└── README.md
```

## Environment Variables

### Frontend (`frontend/.env.local`)
| Variable | Description | Default |
|----------|-------------|---------|
| `NEXTAUTH_SECRET` | Secret for NextAuth session encryption | (required) |
| `NEXTAUTH_URL` | URL of the Next.js app | `http://localhost:3000` |
| `DATABASE_URL` | Prisma database URL | `file:./dev.db` |

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | SQLite database path | `file:./dev.db` |

## Database Schema

- **User** - User accounts with email/password auth
- **Client** - Client information (name, email, company, etc.)
- **Invoice** - Invoices with status, dates, totals
- **InvoiceItem** - Line items for each invoice
- **Account/Session** - NextAuth required models

## Available Scripts

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma studio` - Open Prisma database browser

### Backend
- `python main.py` - Start development server with auto-reload

## License

MIT
