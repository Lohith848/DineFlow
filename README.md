# DineFlow

A modern online food ordering platform that lets customers browse the menu, place orders, and send them directly to the restaurant through WhatsApp.

---

## Features

- User authentication with Supabase (Email & Password)
- Customer profile management
- Menu browsing with categories and pricing
- Persistent shopping cart using Zustand and localStorage
- WhatsApp-based order placement
- Order history for customers
- Admin dashboard for:
  - Menu management
  - Order management
  - Restaurant settings

---

## Tech Stack

- Framework: Next.js 16 (App Router)
- Database & Authentication: Supabase
- Styling: Tailwind CSS v4, shadcn/ui
- State Management: Zustand
- Deployment: Vercel

---

## Installation

Prerequisites

- Node.js 18 or later
- Supabase project

Clone the Project

git clone <repository-url>
cd DineFlow
npm install

---

Supabase Setup

1. Create a Supabase project.
2. Open the SQL Editor.
3. Run the contents of "supabase-schema.sql".

This creates the required tables, policies, and sample data.

---

## Environment Variables

Copy the example file:

cp .env.example .env.local

Update ".env.local":

NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_WHATSAPP_NUMBER=916383346991

---

## Admin Setup

1. Run the application.
2. Create an account from the login page.
3. Copy your User ID from Supabase → Authentication → Users.
4. Execute:

INSERT INTO admins (id, email)
VALUES ('your-user-id', 'your@email.com');

---

## Run the Application

npm run dev

Visit:

http://localhost:3000

---

## Project Structure

DineFlow/
├── app/
│   ├── admin/
│   ├── auth/
│   ├── cart/
│   ├── checkout/
│   ├── login/
│   ├── menu/
│   ├── orders/
│   ├── profile/
│   ├── middleware.ts
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── ui/
│   ├── Header.tsx
│   └── Footer.tsx
├── lib/
│   ├── actions/
│   ├── supabaseClient.ts
│   ├── supabaseServer.ts
│   ├── supabaseMiddleware.ts
│   ├── types.ts
│   └── utils.ts
├── store/
│   └── cart.ts
├── supabase-schema.sql
└── .env.example

---

## Deployment

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Configure the required environment variables.
4. Deploy.

---

## Database

Tables

- "profiles"
- "menu_items"
- "orders"
- "hotel_settings"
- "holidays"
- "admins"

Refer to "supabase-schema.sql" for the complete schema and Row Level Security policies.

---

## WhatsApp Ordering

Orders are sent using the standard WhatsApp URL format:

https://wa.me/<number>?text=<encoded-message>

Each order contains:

- Customer information
- Delivery address
- Ordered items
- Quantity
- Total amount
- Payment method

---

## Security

- Row Level Security (RLS)
- Protected application routes
- Server-side input validation
- Database-level admin authorization

---

## License

MIT

---

## Author

Lohith G.
