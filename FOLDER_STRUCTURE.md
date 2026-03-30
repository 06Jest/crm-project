# CRM Project — Full Folder Structure

```
src/
├── main.tsx
├── App.tsx
├── theme.ts
│
├── types/
│   ├── contact.ts          ✓ done
│   ├── lead.ts
│   ├── deal.ts
│   ├── activity.ts
│   └── user.ts
│
├── store/
│   ├── store.ts            ✓ done
│   ├── contactsSlice.ts    ✓ done
│   ├── leadsSlice.ts
│   ├── dealsSlice.ts
│   └── uiSlice.ts          (theme, sidebar open/close)
│
├── lib/
│   ├── supabase.ts         ✓ done
│   └── auth0.ts            (Auth0 config)
│
├── hooks/
│   ├── useContacts.ts
│   ├── useLeads.ts
│   └── useAuth.ts
│
├── components/
│   ├── Header.tsx          ✓ done
│   ├── Topbar.tsx          ✓ done
│   ├── Footer.tsx          ✓ done
│   ├── Sidebar.tsx         (add later)
│   ├── ProtectedRoute.tsx  (NEW — guards app pages)
│   ├── StatCard.tsx        (reusable dashboard card)
│   ├── PageHeader.tsx      (reusable page title + breadcrumb)
│   └── LoadingSpinner.tsx
│
├── layout/
│   ├── MainLayout.tsx      ✓ done  → rename to AppLayout.tsx
│   ├── PublicLayout.tsx    (NEW — for landing, pricing, about)
│   └── AuthLayout.tsx      (NEW — for login, register, forgot pw)
│
└── pages/
    │
    ├── public/             (no login needed)
    │   ├── Landing/
    │   │   └── Landing.tsx
    │   ├── Pricing/
    │   │   └── Pricing.tsx
    │   └── About/
    │       └── About.tsx
    │
    ├── auth/               (login flow)
    │   ├── Login/
    │   │   └── Login.tsx
    │   ├── Register/
    │   │   └── Register.tsx
    │   └── ForgotPassword/
    │       └── ForgotPassword.tsx
    │
    └── app/                (protected — login required)
        ├── Dashboard/
        │   └── Dashboard.tsx
        ├── Contacts/
        │   ├── Contacts.tsx        ✓ done
        │   └── ContactDetail.tsx   (click a row → full profile)
        ├── Leads/
        │   └── Leads.tsx
        ├── Deals/
        │   └── Deals.tsx
        ├── Activities/
        │   └── Activities.tsx
        ├── Customers/
        │   └── Customers.tsx
        ├── Reports/
        │   └── Reports.tsx
        ├── Profile/
        │   └── Profile.tsx
        └── Settings/
            └── Settings.tsx
```

## Route map

| Path                      | Page             | Layout        | Protected |
|---------------------------|------------------|---------------|-----------|
| `/`                       | Landing          | PublicLayout  | No        |
| `/pricing`                | Pricing          | PublicLayout  | No        |
| `/about`                  | About            | PublicLayout  | No        |
| `/login`                  | Login            | AuthLayout    | No        |
| `/register`               | Register         | AuthLayout    | No        |
| `/forgot-password`        | ForgotPassword   | AuthLayout    | No        |
| `/app/dashboard`          | Dashboard        | AppLayout     | Yes       |
| `/app/contacts`           | Contacts         | AppLayout     | Yes       |
| `/app/contacts/:id`       | ContactDetail    | AppLayout     | Yes       |
| `/app/leads`              | Leads            | AppLayout     | Yes       |
| `/app/deals`              | Deals            | AppLayout     | Yes       |
| `/app/activities`         | Activities       | AppLayout     | Yes       |
| `/app/customers`          | Customers        | AppLayout     | Yes       |
| `/app/reports`            | Reports          | AppLayout     | Yes       |
| `/app/profile`            | Profile          | AppLayout     | Yes       |
| `/app/settings`           | Settings         | AppLayout     | Yes       |
