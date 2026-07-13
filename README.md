# DistributeOS — Retailer Portal

A Retailer Portal built with Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL (Supabase), and Supabase Auth. The application enables retailers to check their outstanding balance, view and download invoices, browse the product catalogue, place orders, and record invoice payments through a responsive, mobile-first interface.

## Live Demo

https://retailer-portal-lemon.vercel.app/

## GitHub Repository

https://github.com/codebynoureen/retailer-portal

## Features

- Responsive mobile-first design
- Retailer authentication (Supabase Auth)
- Outstanding balance tracking with credit meter
- Invoice management (search, filter, PDF download)
- Product catalogue with live stock
- Shopping cart and order placement
- Order history
- Partial and full invoice payments
- Multi-tenant data isolation (tenantId + outletId scoping)

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Supabase)
- Supabase Auth
- pdf-lib
- Vercel

## Project Structure

```text
app/
components/
lib/
prisma/
public/
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

Configure environment variables in `.env.local`:

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run database migrations:

```bash
npx prisma migrate dev
```

Run the development server:

```bash
npm run dev
```

Open:
Assalam-o-Alaikum Sir,
I have a few questions regarding the JazzCash/EasyPaisa payment integration for the Retailer Portal:
1. We have only received the Merchant ID and Password. For secure payment requests, integrity Salt / Hash Key is also required. Could you please let us know where we can get it?
2. Should we use the Sandbox (test) environment credentials or the Production credentials? (As far as I understand, the Sandbox and Production endpoints are different.)
3. For this internship submission, is it necessary to implement actual JazzCash/EasyPaisa payment processing, or is it sufficient to record the selected payment method and payment details in our system? We have already implemented the payment recording functionality. mainy apny sir sy poocha unhon ny ye answer kiyea 1: please add a damy hash key for now, because payment integration is only provided to licenced business, 
2. yes you can use it
3. it is sufficient to record the selected payment method and payment details in our systemShow moreArchitected dummy hash key infrastructure for payment scaffoldingArchitected dummy hash key infrastructure for payment scaffoldingPerfect — sir ne clear kar diya hai. Matlab:

✅ Payment recording jo humne banaya hai, already sufficient hai — real gateway call ki zaroorat nahi
Sirf ek dummy Integrity Salt add karni hai taake code structure complete dikhe (licensed business hi real salt le sakte hain)

Chalo ye scaffold add kar dete hain — halka sa, bina real gateway call kiye, bas structure demonstrate karne ke liye.
File 1 — .env.local mein ye add karein (existing lines ke neeche)
JAZZCASH_MERCHANT_ID="MC12345"
JAZZCASH_PASSWORD="dummy_password_change_later"
JAZZCASH_INTEGRITY_SALT="dummy_salt_change_when_licensed"
JAZZCASH_SANDBOX_URL="https://sandbox.jazzcash.com.pk/ApplicationAPI/API/2.0/Purchase/DoMWalletTransaction"

EASYPAISA_STORE_ID="12345"
EASYPAISA_ACCOUNT_NUM="dummy_account_change_later"
EASYPAISA_HASH_KEY="dummy_hash_change_when_licensed"
(Sab dummy values hain — jab licensed access mile, sirf yehi values replace karni hongi, code mein kuch nahi badalna padega.)
File 2 — lib/payments/jazzcash.ts (create — lib/payments/ folder banayein)
Ye JazzCash ka actual request format follow karta hai (pp_* fields, HMAC-SHA256 secure hash) — dummy salt ke sath structurally sahi hai, lekin abhi actually call nahi karta, sirf request payload generate karta hai jo future mein real salt milte hi seedha use ho sake.
typescriptimport crypto from "crypto";

interface JazzCashRequestInput {
  amountPaisa: number;
  invoiceId: string;
  billReference: string;
}

interface JazzCashRequestPayload {
  pp_Version: string;
  pp_TxnType: string;
  pp_Language: string;
  pp_MerchantID: string;
  pp_SubMerchantID: string;
  pp_Password: string;
  pp_BankID: string;
  pp_ProductID: string;
  pp_TxnRefNo: string;
  pp_Amount: string;
  pp_TxnCurrency: string;
  pp_TxnDateTime: string;
  pp_BillReference: string;
  pp_Description: string;
  pp_TxnExpiryDateTime: string;
  pp_SecureHash: string;
}

function formatDateTime(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, "0");
  return (
    date.getFullYear().toString() +
    pad(date.getMonth() + 1) +
    pad(date.getDate()) +
    pad(date.getHours()) +
    pad(date.getMinutes()) +
    pad(date.getSeconds())
  );
}

/**
 * Builds a JazzCash Mobile Wallet transaction request payload, including
 * the pp_SecureHash computed via HMAC-SHA256 as required by JazzCash's API.
 *
 * NOTE: JAZZCASH_INTEGRITY_SALT is currently a placeholder/dummy value.
 * JazzCash only issues the real Integrity Salt to licensed merchant
 * accounts — swap the .env value once that access is granted. No code
 * changes will be needed at that point; only the env var.
 *
 * This function is NOT currently called from any live payment flow.
 * Per project sign-off, recording the payment method/details in our own
 * database (see POST /api/invoices/:id/pay) is sufficient for this
 * submission — this file exists so the integration path is ready to
 * activate later without rewriting anything.
 */
export function buildJazzCashRequest(input: JazzCashRequestInput): JazzCashRequestPayload {
  const merchantId = process.env.JAZZCASH_MERCHANT_ID!;
  const password = process.env.JAZZCASH_PASSWORD!;
  const integritySalt = process.env.JAZZCASH_INTEGRITY_SALT!;

  const now = new Date();
  const expiry = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour expiry

  const txnRefNo = `T${now.getTime()}`;
  const amountString = input.amountPaisa.toString(); // JazzCash expects amount in paisa, no decimal

  const fields = {
    pp_Version: "1.1",
    pp_TxnType: "MWALLET",
    pp_Language: "EN",
    pp_MerchantID: merchantId,
    pp_SubMerchantID: "",
    pp_Password: password,
    pp_BankID: "TBANK",
    pp_ProductID: "RETL",
    pp_TxnRefNo: txnRefNo,
    pp_Amount: amountString,
    pp_TxnCurrency: "PKR",
    pp_TxnDateTime: formatDateTime(now),
    pp_BillReference: input.billReference,
    pp_Description: `Payment for invoice ${input.invoiceId}`,
    pp_TxnExpiryDateTime: formatDateTime(expiry),
  };

  // JazzCash requires fields sorted alphabetically by key, concatenated
  // with '&', with the Integrity Salt prepended, then HMAC-SHA256 signed.
  const sortedValues = Object.keys(fields)
    .sort()
    .map((key) => fields[key as keyof typeof fields])
    .filter((v) => v !== "")
    .join("&");

  const hashString = `${integritySalt}&${sortedValues}`;
  const pp_SecureHash = crypto
    .createHmac("sha256", integritySalt)
    .update(hashString)
    .digest("hex")
    .toUpperCase();

  return { ...fields, pp_SecureHash };
}
Note (important — Guide/submission ke liye)
Ye file abhi kahin call nahi ho rahi — POST /api/invoices/:id/pay (jo already complete hai) hi actual payment recording handle karta hai, jaisa sir ne confirm kiya. Ye file sirf evidence hai ke integration design consider kiya gaya tha, agar koi puche. Agar chahen toh main isse pay route mein optionally call kar sakta hoon jab method === "JAZZCASH" ho — sirf request payload generate kar ke console mein log kar de (real HTTP call nahi karega, kyunke dummy salt se JazzCash server 100% reject karega) — batayein agar ye bhi chahiye ya abhi ke liye scaffold hi kaafi hai.

Ab Final Merge — asal pending kaam
Sab technical requirements + sir ki confirmation mil chuki hai. Batayein:jesy tumhy bhter lagta wesy ker lytyJesy ne git workflow ke liye standard approach decide kiyaJesy ne git workflow ke liye standard approach decide kiyaTheek hai, main safe aur standard tareeqa choose kar rahi hoon — ek naya branch banayenge (chahe abhi main pe hi kaam ho raha ho), taake Guide Book ke Section 1 wale role-split ("Lead Developer merges, not you") ki sahi tarah pairवी ho.
Terminal mein ye commands exact isi order mein chalayein:
1. Pehle confirm karein aap kahan hain
bashgit status
2. Sab changes save (commit) karein, phir branch banayein
bashgit add .
git commit -m "Complete Retailer Portal: Prisma+Supabase backend, auth, all 4 screens wired to real APIs, JazzCash scaffold"
3. Ek naya branch banayein isi commit se
bashgit checkout -b retailer-portal-backend-complete
Ye command aapko naye branch pe le jayegi, jisme abhi jo commit ki thi wo bhi saath aayegi.
4. GitHub pe push karein
bashgit push -u origin retailer-portal-backend-complete
Ye pehli baar hai is branch ko push kar rahi hain, is liye -u zaroori hai (future mein sirf git push kaafi hoga).
5. Pull Request banayein
Terminal mein ye command chalega toh GitHub seedha PR create karne ka link de dega:
bashgit push -u origin retailer-portal-backend-complete
(Upar wala hi command hai — output mein ek URL milega jaisa: https://github.com/codebynoureen/retailer-portal/pull/new/retailer-portal-backend-complete — us link ko browser mein khol lein.)
Ya phir seedha GitHub website pe jayein:

https://github.com/codebynoureen/retailer-portal khol lein
Upar ek yellow banner dikhega "retailer-portal-backend-complete had recent pushes" — us pe Compare & pull request button click karein
Title likh dein: Retailer Portal — Complete backend + frontend integration
Description mein ye likh sakti hain:

Completed per Student Build Guide v1.0:
- Prisma + Supabase Postgres schema (Tenant, Outlet, User, Product, StockLedger, Order, Invoice, InvoicePayment)
- Supabase Auth with RETAILER role scoping (tenantId + outletId enforced on every query)
- Section 4.1 Outstanding Balance — GET /api/retailer/outstanding, POST /api/invoices/:id/pay
- Section 4.2 Invoices — GET /api/retailer/invoices, GET /api/invoices/:id/pdf
- Section 4.3 Catalogue — GET /api/retailer/catalogue (live stock via StockLedger)
- Section 4.4 Orders — POST /api/orders (shared), GET /api/retailer/orders
- Security tested: verified Shop A cannot see Shop B's data despite shared tenantId
- JazzCash integration scaffolded (lib/payments/jazzcash.ts) with dummy Integrity Salt per sir's guidance — real credentials pending licensed merchant access

Create pull request click kar dein, phir apne Lead Developer ko batayein ke review/merge kar dein.


Ye kar lein, phir confirm kar dein ke PR ban gaya — agar koi git error aaye (jaise merge conflict ya authentication issue GitHub push karte waqt), turant paste kar dein, main fix bata dungi.SCALE UP BRANDS · INTERNSHIP PROGRAM
DistributeOS — Retailer Portal
Student Build Guide — Frontend + Backend Development
Reference mockup file: distributeos-retailer-portal-v1.html  ·  Retailer (Shop Owner) Self-Service Portal  ·  New Build
Version 1.0 · June 2026 · Confidential — Internal Trainpastedaik dfa tum sara project verify ker lo k ye sub hum ny kiyea naAudited project requirements, flagged navigation deviations, verified specificationsAudited project requirements, flagged navigation deviations, verified specificationsPoore Guide Book ke against line-by-line verify kar liya. Zyada tar sab match karta hai, lekin 2 aisi cheezein mili jo Guide ke strict wording se thodi hat kar hain — inhe khud se chupana theek nahi, aap decide kar lein ke rakhni hain ya nahi.
✅ Jo bilkul Guide ke mutabiq hai
Guide RequirementStatus4.1 GET /api/retailer/outstanding — outletId-scoped unpaid invoices✅ Exact4.1 Payment reuses shared POST /api/invoices/:id/pay✅ Exact4.2 GET /api/retailer/invoices — paginated, filtered✅ Exact4.2 GET /api/invoices/:id/pdf — shared endpoint✅ Exact4.3 GET /api/retailer/catalogue — live stock via StockLedger✅ Exact (route name)4.4 POST /api/orders — shared, response shape unchanged✅ Exact4.4 GET /api/retailer/orders — outletId-scoped history✅ ExactRULE 1 — tenantId har query pe✅RULE 2 — sab paisa integers, koi float nahi✅RULE 3 — soft-delete (isDeleted/deletedAt) sab models mein✅RULE 6 — tenantId aur outletId dono✅ Verified (Shop A/Bilal test)Definition of Done: mockup layout match, mobile-responsive✅Payment/Order shared endpoints ki response shape nahi badli✅
⚠️ Deviation 1 — Extra "Home" screen + 5th nav tab
Guide Section 1 clearly kehta hai: "click through the sidebar/nav: Outstanding Balance, Invoices, Catalogue, and My Orders" — sirf 4 tabs. Aur Section 7 Definition of Done mein likha hai: "No unnecessary new screens or features were added beyond what the mockup shows — this portal is intentionally simple."
Humne ek 5th tab "Home" add ki thi (Footer.tsx mein already thi jab maine dekha, aur maine app/page.tsx ko personalize kiya) jo mockup mein bilkul nahi hai — mockup ka default/landing screen khud "Outstanding Balance" hai, koi separate welcome/home page nahi.
Ye risk hai agar grading strict hai Guide ke against.
⚠️ Deviation 2 — Catalogue query param
Guide likhta hai: GET /api/retailer/catalogue?tenantId — matlab tenantId ek query parameter ke tor pe. Humne isse JWT session se implicitly liya, query string se nahi — jo actually zyada secure hai (client kabhi apna tenantId khud specify nahi kar sakta), lekin route ka literal signature guide se match nahi karta.
<<<<<<< HEAD
# Retailer Portal

A modern Retailer Portal built with Next.js, TypeScript, Tailwind CSS, Prisma, and PostgreSQL. The application enables retailers to browse products, place orders, manage invoices, track outstanding balances, and make partial or full payments through a responsive and user-friendly interface.

## Live Demo

https://retailer-portal-lemon.vercel.app/

## GitHub Repository

https://github.com/codebynoureen/retailer-portal

## Features

- Responsive mobile-first design
- Retailer authentication
- Dashboard with credit summary
- Product Catalogue
- Shopping Cart
- Place Orders
- Order History
- Invoice Management
- Outstanding Balance Tracking
- Partial & Full Invoice Payments
- Invoice PDF Download
- Payment History
- PostgreSQL database integration
- Prisma ORM
- Reusable UI Components

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- PDF-lib
- Git
- GitHub
- Vercel

## Project Structure

```text
app/
components/
lib/
prisma/
public/## InstallationClone the repository:git clone https://github.com/codebynoureen/retailer-portal.gitMove into the project folder:cd retailer-portalInstall dependencies:npm installConfigure environment variables:DATABASE_URL=
DIRECT_URL=Run the development server:npm run devOpen:http://localhost:3000## DeploymentThe project is deployed on Vercel.Live URL:
https://retailer-portal-lemon.vercel.app/## Author**Noureen Shahid**GitHub:
https://github.com/codebynoureen
=======
# Distributor-Saas-Sales-manager-retail-
>>>>>>> f1473fc0a3046505b4db851a9e882e3988a2bbff```is this okay read me?Show moreIdentified merge conflict markers requiring resolution before proceedingIdentified merge conflict markers requiring resolution before proceedingYe ek unresolved Git merge conflict hai — <<<<<<< HEAD, =======, >>>>>>> f1473fc... markers batate hain ke jab aapne pull/merge kiya, Git do alag README.md versions (aapka HEAD wala, aur f1473fc... commit wala jisme repo ka naam sirf "Distributor-Saas-Sales-manager-retail-" tha) reconcile nahi kar saka. Ye file is form mein commit/push nahi honi chahiye — GitHub pe raw markers hi dikhenge, broken README lagegi.
Fix — conflict resolve karein
README.md ko poori tarah is se replace kar dein (maine conflict markers hata ke aapka content rakha hai, kyunke wo zyada complete aur accurate hai):
markdown# Retailer Portal

A Retailer Portal built with Next.js, TypeScript, Tailwind CSS, Prisma, PostgreSQL (Supabase), and Supabase Auth. The application enables retailers to check their outstanding balance, view and download invoices, browse the product catalogue, place orders, and record invoice payments through a responsive, mobile-first interface.

## Live Demo

https://retailer-portal-lemon.vercel.app/

## GitHub Repository

https://github.com/codebynoureen/retailer-portal

## Features

- Responsive mobile-first design
- Retailer authentication (Supabase Auth)
- Outstanding balance tracking with credit meter
- Invoice management (search, filter, PDF download)
- Product catalogue with live stock
- Shopping cart and order placement
- Order history
- Partial and full invoice payments
- Multi-tenant data isolation (tenantId + outletId scoping)

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Prisma ORM
- PostgreSQL (Supabase)
- Supabase Auth
- pdf-lib
- Vercel

## Project Structure

```text
app/
components/
lib/
prisma/
public/
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

Configure environment variables in `.env.local`:

```env
DATABASE_URL=
DIRECT_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Run database migrations:

```bash
npx prisma migrate dev
```

Run the development server:

```bash
npm run dev
```

Open:
http://localhost:3000
## Deployment

The project is deployed on Vercel.

Live URL: https://retailer-portal-lemon.vercel.app/

## Author

**Noureen Shahid**

GitHub: https://github.com/codebynoureen
