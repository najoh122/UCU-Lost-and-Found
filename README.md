# UCU Campus Lost & Found – Frontend (React)

## Prerequisites
- Node.js 18 or newer
- The backend (Express + MySQL) running on http://localhost:5000

## Quick start (no backend needed): demo mode
```bash
npm install
npm run demo       # open http://localhost:5173
```
Demo mode keeps fake data in your browser. Accounts (password `password123`):
student `namusoke@students.ucu.ac.ug`, other student `okello@students.ucu.ac.ug`, administrator `admin@ucu.ac.ug`.
Demo mode is for development only. For the real submission use `npm run dev` with the backend running.

## Install and run (real backend)
```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in /dist
```
`vite.config.js` forwards `/api` and `/uploads` to the backend in development.
For a deployed build, set `VITE_API_URL` (see `.env.example`).

## Folder map
- `src/api.js` – every call to the backend (one place to change URLs)
- `src/AuthContext.jsx` – login state, token storage, logout
- `src/pages/` – Login, Home, ReportForm (create + edit), ItemDetail (claim form), MyActivity, Admin
- `src/components/` – Navbar, ItemCard, Field, StatusBadge, Feedback (loading/empty/alerts), ProtectedRoute
- `src/styles.css` – all styling (mobile first)

## API contract the backend must follow
Send `Authorization: Bearer <token>` on protected routes. Errors: `{ "message": "...", "errors": { "field": "..." } }`.

| Method & path | Body | Returns |
|---|---|---|
| POST /api/auth/register | name, email, password | `{ token, user:{id,name,role} }` |
| POST /api/auth/login | email, password | `{ token, user }` |
| POST /api/auth/logout | – | `{ ok:true }` (invalidate the token) |
| GET /api/items?q&type&category&location&date&status | – | array of public items: id, type, title, category, description, date, location, photo_url, status (`open`/`returned`). NO private details |
| GET /api/items/:id | – | public item + `is_owner` (bool). If owner/admin: also `private_details`. If logged in and has claimed: `my_claim:{id,status,evidence,admin_reason}` |
| POST /api/items | multipart: type,title,category,description,date,location,private_details?,photo? | `{ id }` |
| PUT /api/items/:id | same as above (owner only) | `{ id }` |
| GET /api/my/items | – | array of own items |
| POST /api/items/:id/claims | `{ evidence }` | created claim (reject own item, returned item, duplicate) |
| GET /api/my/claims | – | array: id, item_id, item_title, status, admin_reason, created_at |
| GET /api/admin/claims | – | array: id, item_id, item_title, item_status, item_private_details, claimant_name, evidence, status, admin_reason, created_at (admin only) |
| PATCH /api/admin/claims/:id | `{ decision:'approved'｜'rejected', reason }` | updated claim (only one approved claim per item) |
| POST /api/admin/items/:id/return | – | item marked `returned` (only after an approved claim) |

Item statuses: `open`, `returned`. Claim statuses: `pending`, `approved`, `rejected`.

## Security note
Hiding buttons or pages in React is only for convenience. The backend must enforce every permission and must never send private details or claim evidence to people who should not see them.
