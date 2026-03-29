# BASE Exchange Challenge

This repository contains a technical challenge implementation for an order management interface focused on financial assets. The project combines a Next.js frontend with a local mock API that supports order listing, filtering, sorting, order details, executions, and order creation with matching logic.

## Stack

- Next.js 16
- React 19
- TypeScript
- TanStack Query
- TanStack Table
- Zustand
- Vitest + Testing Library
- Playwright
- `json-server` with custom matching/filter logic

## Local setup

This is the most important section if you want to evaluate or review the challenge locally.

### Prerequisites

- Node.js 20+ recommended
- npm

### Step by step

1. Install dependencies:

```bash
npm install
```

2. Create your local environment file:

```bash
cp .env.example .env.local
```

If you are on Windows PowerShell and do not want to copy the file manually, you can create `.env.local` with:

```powershell
Copy-Item .env.example .env.local
```

3. Generate seed data:

```bash
npm run seed
```

The official default seed size is `1200`. If you want a different amount for local testing, pass it dynamically:

```bash
npm run seed -- 10000
```

4. Start the mock API in one terminal:

```bash
npm run dev:api
```

The API runs on:

```text
http://localhost:3001
```

5. Start the frontend in another terminal:

```bash
npm run dev
```

6. Open the app:

```text
http://localhost:3000
```

### Quick run summary

If you already installed dependencies and created `.env.local`, the local flow is:

```bash
npm run seed
npm run dev:api
npm run dev
```

### Recommended reviewer flow

If you want the shortest possible path to evaluate the challenge:

1. Run `npm install`
2. Run `npm run seed`
3. Run `npm run dev:api`
4. Run `npm run dev`
5. Open `http://localhost:3000/orders`
6. Verify the default redirect adds `createdAt_gte`
7. Try filtering, sorting, opening details, creating an order, changing settings, and regenerating the database

## Environment variables

The frontend uses `NEXT_PUBLIC_API_URL` to reach the API.

Example `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

If omitted, the app falls back to `http://localhost:3001`.

## Technical challenge notes

This project is organized as a technical challenge submission, so the most relevant reviewer topics are:

- how to run it locally
- design decisions and tradeoffs
- backend matching behavior
- testing strategy

## Available scripts

- `npm run dev`: starts the Next.js app
- `npm run dev:api`: starts the local mock API
- `npm run seed`: regenerates `server/db.json` with the official default of `1200` items
- `npm run seed -- <count>`: regenerates `server/db.json` with a custom item count for local testing
- `npm run test`: runs Vitest in watch mode
- `npm run test:run`: runs Vitest once
- `npm run test:e2e`: runs the Playwright end-to-end suite
- `npm run test:e2e:ui`: opens the Playwright UI runner
- `npm run build`: creates a production build
- `npm run lint`: runs ESLint

## Main features

- Infinite order table with server-backed pagination
- Multi-sort and filterable columns
- Row expansion and order detail dialog
- Executions and status history views
- Order creation form with validation
- Database regeneration from the header
- Local persistence for user and table preferences

## How to use the site

This section is intended to help a reviewer navigate the application quickly.

### 1. Open the orders page

- visit `http://localhost:3000/orders`
- if `createdAt_gte` is missing, the page redirects automatically and adds the start of the current day
- this is intentional so the first screen shows today's orders by default

### 2. Explore the main orders table

- the table loads data from the local API and continues loading more rows as you scroll
- the footer shows `loaded rows / total matching rows`
- the URL reflects the current table state so filters and sorting can be shared

### 3. Filter the data

- use the filter buttons in the column headers
- text filters, checkbox filters, numeric ranges, and date ranges are supported
- active filters appear above the table and can be removed individually or cleared all at once
- all filter state is encoded in the URL

### 4. Sort and multi-sort

- click a sortable column header to sort by that field
- click again to change direction
- use `Shift + click` to build a multi-sort
- the resulting sort order is persisted in the `sort` query param

### 5. Open row details

- left click on a row to open the details dialog
- use the tabs inside the dialog to inspect status history and executions
- expand a row inline to preview extra information without opening the full dialog

### 6. Use the row context menu

- right click a row to open its context menu
- from there you can:
- `View Details`
- `Copy ID`
- `Cancel Order` when the order is still cancellable

### 7. Create an order

- click `New Order`
- fill instrument, side, price, currency, and quantity
- submit the dialog and wait for server confirmation
- the new order appears only after the backend confirms creation

### 8. Regenerate the local database

- click `Regenerate DB` in the header
- confirm the action
- choose how many items should be created
- the official default is `1200`
- the allowed range is `1200` to `100000`
- this rewrites the local `server/db.json` and refreshes the UI

### 9. Change user settings

- click `Settings` in the header
- choose theme, preferred currency, date format, and time format
- preferred currency becomes the default currency in the create-order dialog
- date and time preferences immediately affect how timestamps are rendered across the UI

## Orders page behavior

The orders page is driven by URL search parameters so the current table state can be shared and restored.

Initial behavior:

- if `createdAt_gte` is missing, the page redirects to `/orders` with `createdAt_gte` set to the start of the current day
- this means the default reviewer experience shows today's orders first
- the official default seed size is `1200` items

Pagination and loading:

- order loading uses `useInfiniteQuery`
- the table fetches data page by page from the API and appends the next page as the user scrolls
- the footer shows how many rows are already loaded versus the total number of matching rows

Filters:

- filters are stored in the URL
- text filters use direct query params such as `status=open`
- multi-value filters use comma-separated values in the same param
- numeric filters use `_gte` and `_lte`
- date filters also use `_gte` and `_lte`
- compact date values in the URL are normalized before the API request
- active filters are rendered as removable badges above the table

Sorting:

- sorting is server-driven
- the `sort` query param supports multi-sort using comma-separated fields
- descending fields use a leading `-`
- example: `sort=-createdAt,price`
- multi-sort priority follows the order of fields in the `sort` param

Row interactions:

- left click opens the order details dialog
- expanding a row reveals executions and status history
- right click opens a context menu for the selected order
- the context menu includes `View Details` and `Copy ID`
- when the order status is `open` or `partial`, the context menu also includes `Cancel Order`

Header tools:

- `Regenerate DB` opens a confirmation dialog and calls the local reseed endpoint
- `Settings` lets the user switch theme, preferred currency, date format, and time format
- preferred currency is used as the default currency in the create-order dialog
- date and time preferences affect how timestamps are rendered across the UI

## Project structure

- `src/app`: app routes and page shells
- `src/components`: UI, table, orders, and layout components
- `src/hooks`: table, filters, navigation, and order-related hooks
- `src/lib`: API client, formatters, schemas, constants, and helpers
- `src/stores`: Zustand state for user table preferences
- `server`: mock API, seed generation, and matching logic

## API and backend notes

The local API lives in [server/index.js](./server/index.js) and extends `json-server` with custom endpoints and business rules.

Key backend capabilities:

- order filtering by text, multi-value fields, numeric ranges, and dates
- multi-field sorting
- order creation with matching against opposite-side open orders
- execution generation
- status history generation
- database regeneration through an admin endpoint that reuses the seed generator

Seed data is generated by [server/seed.js](./server/seed.js) using helpers in [server/seed-utils.cjs](./server/seed-utils.cjs). The official default is `1200`, and the script also supports a custom count, for example `npm run seed -- 10000`.

The header includes a "Regenerate DB" action. It opens a confirmation dialog where you can choose how many items to create. The official default is `1200`, the allowed range is `1200` to `100000`, and the backend uses the same seed logic behind `npm run seed`.

## Design decisions

### No optimistic updates for order creation

This was intentional. Orders represent financial data, so the UI waits for server confirmation before showing the final created order. React Query optimistic updates were considered, but rejected for this flow to avoid showing unconfirmed financial operations.

### URL-friendly date filters

Date parameters use compact URL formats such as:

- `2026-03-28`
- `2026-03-28T05:00Z`

These values are parsed and normalized to full ISO values before API calls.

### Seed data spans 7 days

Seeded orders are generated between the current day and 7 days earlier. The default orders page applies a filter that shows today's orders first.

### Local table customization

Table preferences are intentionally persisted in local storage through Zustand:

- column order
- default sort
- rows per page

This keeps the table personalized without requiring a backend user profile.

### User settings are local-only

User preferences are intentionally stored in local storage:

- theme: `light`, `dark`, or `system`
- preferred currency
- preferred date format
- preferred time format

These preferences affect presentation only. They do not change API payload formats or perform currency conversion.

## Tests

The project includes automated tests for:

- utility functions
- API helpers
- schemas
- Zustand store behavior
- hooks
- shared UI components
- order workflows
- core server matching/filter logic
- end-to-end browser flows with Playwright

Run tests in watch mode:

```bash
npm run test
```

Run tests once:

```bash
npm run test:run
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Current note:

- the Playwright E2E suite covers the critical reviewer flows on the orders screen
- the full automated suite passes
- coverage thresholds configured in Vitest still require more work to reach the global target

## Deliberately out of scope for this challenge

The goal of this submission was to demonstrate architecture, order workflows, filtering, matching logic, local state, and testing strategy. The items below are known improvements for a version beyond the scope of this challenge:

- real backend persistence instead of the current local/mock API
- hosted reseed support without relying on writes to `server/db.json`
- authentication and authorization
- realtime updates through websockets, streaming, or an equivalent mechanism
- production hardening such as observability, structured logs, metrics, rate limiting, and operational policies
- further expansion of the automated test suite beyond the critical flows already covered

## Documentation notes

Tests and README documentation were produced with engineering assistance from AI tools, including Codex and Claude, with human review and final project decisions applied afterward.

## Other languages

- Portuguese: [README.md](./README.md)
