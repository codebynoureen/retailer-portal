# Retailer Portal

A responsive Retailer Portal built with Next.js, TypeScript, and Tailwind CSS. The application allows retailers to browse products, place orders, view invoices, and monitor outstanding payments through a clean and user-friendly interface.

## Live Demo

https://retailer-portal-lemon.vercel.app/

## GitHub Repository

https://github.com/codebynoureen/retailer-portal

## Features

- Responsive mobile-first design
- Dashboard/Home page
- Product Catalogue
- Increase/Decrease product quantity
- Shopping Cart functionality
- Order Review page
- Invoice List
- Invoice Details
- Outstanding Payments
- Print Invoice
- Clean and reusable components
- Local Storage support for cart

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- HTML5
- Git
- GitHub
- Vercel

## Project Structure

```text
app/
├── catalogue/
├── invoices/
│   └── [id]/
├── orders/
├── outstanding/
├── layout.tsx
└── page.tsx

components/
├── AlertCard.tsx
├── Button.tsx
├── CreditCard.tsx
├── CreditMeter.tsx
├── DownloadButton.tsx
├── Footer.tsx
├── Header.tsx
├── InvoiceCard.tsx
├── KpiCard.tsx
├── OrderCard.tsx
├── PaymentHistory.tsx
├── ProductCard.tsx
└── WelcomeSection.tsx

data/
├── invoices.ts
├── orders.ts
└── products.ts
```

## Installation

Clone the repository:

```bash
git clone https://github.com/codebynoureen/retailer-portal.git
```

Move into the project folder:

```bash
cd retailer-portal
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```
http://localhost:3000
```

## Deployment

The project is deployed on Vercel.

Live URL:
https://retailer-portal-lemon.vercel.app/

## Author

**Noureen Shahid**

GitHub:
https://github.com/codebynoureen
