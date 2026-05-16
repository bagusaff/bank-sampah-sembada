# 🗑️ Bank Sampah Sembada — Digital Management System

A web application to digitize the operations of a local waste bank (bank sampah) in Indonesia. Built to replace manual record-keeping with a modern, role-based digital system.

---

## ✨ Features

### 🌐 Public Portal

- View current waste prices grouped by category
- Read announcements and news without logging in

### 👤 Member Zone

- Phone-based OTP login (no email/password needed)
- Monitor deposit history and current balance
- Request cash withdrawals (manual pickup or bank transfer)
- Save bank account details for future withdrawals
- In-app notifications for every deposit and withdrawal update

### 🛠️ Admin Panel

- Input member deposits with auto-calculated totals
- Manage waste types and prices (with full price history)
- Process withdrawal requests one by one
- Manage members and view their full history
- Publish news and announcements
- Export monthly reports to Excel (.xlsx)

---

## 🧱 Tech Stack

| Layer            | Technology                              |
| ---------------- | --------------------------------------- |
| Frontend         | React 18 + TypeScript                   |
| Build Tool       | Vite                                    |
| Styling          | TailwindCSS v4                          |
| Backend          | Supabase (PostgreSQL + Auth + Realtime) |
| Routing          | React Router v6                         |
| State Management | Zustand                                 |
| Server State     | TanStack React Query                    |
| Forms            | React Hook Form + Zod                   |
| Icons            | Lucide React                            |
| Notifications    | React Hot Toast                         |
| Date Utilities   | date-fns                                |
| Excel Export     | SheetJS (xlsx)                          |

---

## 🗄️ Database Overview

10 tables managed via Supabase PostgreSQL:

| Table                 | Description                                                 |
| --------------------- | ----------------------------------------------------------- |
| `profiles`            | Extends auth.users — stores role, name, phone               |
| `bank_accounts`       | Member's saved bank accounts (multiple per member)          |
| `trash_types`         | Waste categories and types (e.g. Plastik → Botol Plastik)   |
| `trash_prices`        | Price history per waste type (locked at deposit time)       |
| `deposits`            | Each weighing session recorded by admin                     |
| `member_balances`     | Denormalized balance per member (auto-updated via triggers) |
| `withdrawal_requests` | Cash withdrawal requests with status tracking               |
| `news`                | Public announcements and price updates                      |
| `notifications`       | In-app notifications per user                               |
| `audit_logs`          | Immutable log of all sensitive operations                   |

Row Level Security (RLS) is enabled on all tables. Database triggers handle balance updates and notifications automatically.

---

## 🚀 Getting Started

### Prerequisites

- Node.js v18+
- npm or pnpm
- A [Supabase](https://supabase.com) account

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/bank-sampah-digital.git
cd bank-sampah-digital
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key-here
```

Get these values from your Supabase project → **Settings → API**.

### 4. Set up the database

In your Supabase project, open the **SQL Editor** and run the full schema script located at:

```
docs/supabase-schema.sql
```

This will create all tables, indexes, RLS policies, triggers, and seed data in the correct order.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
src/
├── components/
│   ├── common/          # Shared UI components (Header, Sidebar, Button, Modal...)
│   ├── admin/           # Admin panel components
│   ├── member/          # Member zone components
│   └── public/          # Public portal components
├── pages/               # Route layouts (AdminLayout, MemberLayout, PublicLayout...)
├── hooks/               # Custom React hooks (useAuth, useDeposits, useWithdrawal...)
├── services/            # Supabase query functions (deposit, price, withdrawal...)
├── context/             # React contexts (AuthContext, NotificationContext)
├── types/               # TypeScript interfaces (matching DB schema)
├── utils/               # Formatters, validators, Excel exporter
├── lib/                 # Supabase client singleton
└── constants/           # App-wide constants
```

---

## 👥 User Roles

| Role       | Access                                                                       |
| ---------- | ---------------------------------------------------------------------------- |
| **Public** | News portal, current prices (no login)                                       |
| **Member** | Deposit history, balance, withdrawal requests                                |
| **Admin**  | Everything — deposit input, price management, withdrawal processing, reports |

Authentication is phone-based OTP via Supabase Auth. Role is stored in the `profiles` table.

---

## 💡 Key Business Rules

- Deposit prices are **locked at the time of deposit** — price changes never affect past records
- Members can only submit **one withdrawal request every 2 days**
- Admin processes withdrawals **one at a time** (no bulk approval)
- Withdrawal methods: **manual pickup** or **manual bank transfer** (no payment gateway)
- Member balance is always computed via **database triggers**, never directly from the frontend
- Only deposits where `is_withdrawn = false` are available for withdrawal

---

## 📊 Monthly Reports

Admin can export monthly reports as `.xlsx` files with 4 sheets:

1. **Summary** — totals for members, deposits, and withdrawals
2. **Deposit Details** — full list with member, waste type, weight, price, total
3. **Withdrawal Details** — full list with member, amount, method, status
4. **Member Balance Sheet** — current balance and lifetime withdrawn per member

---

## 🔒 Security

- Row Level Security (RLS) enabled on all 10 tables
- Members can only access their own data
- Bank account numbers encrypted at application level
- All sensitive operations recorded in immutable `audit_logs`
- OTP valid for 5 minutes, invalidated after use

---

## 🗺️ Roadmap

- [x] Database schema + RLS + triggers
- [x] Phone-based authentication
- [x] Admin panel (prices, members, deposits, withdrawals, news)
- [x] Member zone (dashboard, deposit history, withdrawal flow)
- [x] Public news portal
- [x] Monthly Excel reports
- [x] In-app notifications
- [ ] PDF receipt / slip generation
- [ ] WhatsApp notification for receipts
- [ ] PWA / offline support
- [ ] SMS OTP integration (Twilio)

---

## 🤝 Contributing

This project is built for a specific local waste bank community. If you'd like to adapt it for your own waste bank, feel free to fork the repository and adjust the configuration to your needs.

---

## 📄 License

MIT License — free to use, modify, and distribute.

---

## 🙏 Acknowledgements

Built with [Supabase](https://supabase.com), [React](https://react.dev), and [TailwindCSS](https://tailwindcss.com).
