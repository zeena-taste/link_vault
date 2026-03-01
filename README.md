# 🔒 Link Vault

A full-stack link management app. Save URLs, organise them into collections, and search across them — from the web app or directly from any page via the Chrome Extension.

[![Repo](https://img.shields.io/badge/GitHub-link_vault-black?logo=github)](https://github.com/zeena-taste/link_vault)

---

## How the Code Works

### Frontend (`/frontend`)
Built with React 19 and Vite. All state lives in `App.jsx` and flows down to components via props — no Redux or Context.

**`src/api.js`** — every fetch call to the backend lives here. Uses `import.meta.env.VITE_API_URL` so the backend URL is set via environment variable and never hardcoded.

**`src/App.jsx`** — root component. Holds all state: links, collections, active filters, modal visibility, search term. All handlers live here and get passed down as props.

**`src/components/`**
- `Header.jsx` — search input and add link button
- `sidebar.jsx` — navigation between home and collections. Collapses to a bottom bar on mobile.
- `linklist.jsx` — renders link cards. Hover or tap a card to reveal its note.
- `collectionPage.jsx` — shows all collections with real link counts
- `addlinkbtn.jsx` — modal for adding or editing a link, includes collection assignment and notes
- `addcollectionbtn.jsx` — modal for creating a new collection

### Backend (`/backend`)
Node.js with Express 5 and ES Modules. Two route files handle all CRUD. Data is stored in PostgreSQL on Neon.

**`server.js`** — entry point. Sets up CORS (allows the frontend origin and any `chrome-extension://` origin), registers route files, starts on `process.env.PORT`.

**`routes/links.js`** — all `/links` endpoints. The `/unassigned` and `/collection/:id` routes are defined before `/:id` so Express doesn't match them as ID parameters. A `normalize()` helper converts PostgreSQL BIGINT columns to JS numbers before sending to the frontend.

**`routes/collections.js`** — all `/collections` endpoints.

**`data/db.js`** — creates a `pg` connection pool using `process.env.DATABASE_URL`. All routes import the pool directly.

### Chrome Extension (`/extension`)
Manifest V3. Auto-fills the current tab's title and URL, loads collections from the backend, and POSTs the new link on save.

**`manifest.json`** — declares `activeTab` permission and `host_permissions` for the backend URL. Without `host_permissions`, Manifest V3 silently blocks all fetch calls.

**`popup.js`** — checks server is reachable on open, loads collections, handles save.

---

## Project Structure

```
link_vault/
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── sidebar.jsx
│   │       ├── linklist.jsx
│   │       ├── collectionPage.jsx
│   │       ├── addlinkbtn.jsx
│   │       ├── addcollectionbtn.jsx
│   │       └── CSS/
│   ├── public/
│   │   └── favicon.svg
│   ├── index.html
│   └── package.json
│
├── backend/
│   ├── server.js
│   ├── routes/
│   │   ├── links.js
│   │   └── collections.js
│   ├── data/
│   │   └── db.js
│   └── package.json
│
└── extension/
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    └── style.css
```

---

## Setup & Running Locally

### Prerequisites
- Node.js v18+
- A Chromium-based browser for the extension
- A [Neon](https://neon.tech) free account for the database

### 1. Database

Create a free project on [neon.tech](https://neon.tech), then run this in the Neon SQL Editor:

```sql
CREATE TABLE collections (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL
);

CREATE TABLE links (
  id BIGINT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  notes TEXT DEFAULT '',
  collection_id BIGINT REFERENCES collections(id) ON DELETE SET NULL
);
```

Copy your connection string from Neon — it looks like:
```
postgresql://user:password@ep-xxxx.us-east-2.aws.neon.tech/neondb?sslmode=require
```

### 2. Backend

```bash
cd backend
npm install
```

Create a `.env` file in `backend/`:
```
DATABASE_URL=your-neon-connection-string
FRONTEND_URL=http://localhost:5173
PORT=5000
```

```bash
node server.js
```

Server runs on `http://localhost:5000`.

### 3. Frontend

```bash
cd frontend
npm install
```

Create a `.env` file in `frontend/`:
```
VITE_API_URL=http://localhost:5000
```

```bash
npm run dev
```

App runs on `http://localhost:5173`.

### 4. Chrome Extension

1. Open `chrome://extensions`
2. Enable **Developer Mode**
3. Click **Load unpacked** → select the `extension/` folder

Make sure the backend is running before using the extension.

---

## Environment Variables

### Frontend (`frontend/.env`)
| Variable | Value |
|---|---|
| `VITE_API_URL` | `http://localhost:5000` locally, your Render URL in production |
| `VITE_SENTRY_DSN` | Optional — Sentry DSN for error tracking |

### Backend
| Variable | Value |
|---|---|
| `DATABASE_URL` | Neon PostgreSQL connection string |
| `FRONTEND_URL` | Your deployed frontend URL — used for CORS |
| `PORT` | Set automatically by Render, falls back to 5000 locally |

---

## Deployment

### Database → Neon
Already set up. Data persists independently of any server restarts or redeploys.

### Backend → Render
1. Push to GitHub
2. Render → New Web Service → connect repo → set Root Directory to `backend`
3. Build command: `npm install` — Start command: `npm start`
4. Add environment variables: `DATABASE_URL`, `FRONTEND_URL`

### Frontend → Vercel
1. Vercel → New Project → connect repo → set Root Directory to `frontend`
2. Framework: Vite — Build command: `npm run build` — Output: `dist`
3. Add environment variable: `VITE_API_URL` = your Render URL
4. Deploy

> **Note:** Vite bakes environment variables at build time. If you update `VITE_API_URL` you must redeploy — a restart alone won't pick up the change.

### Extension (production)
Update `API_URL` at the top of `popup.js` to your Render URL, then reload the extension in `chrome://extensions`.

---

## Contributing

Contributions are welcome. Some good starting points:

- **Favicon fetching** — auto-grab the site icon for each saved link
- **Link health checker** — flag broken or redirected URLs
- **Tags** — cross-collection labelling
- **User authentication** — multi-user support with Auth0 or Clerk
- **Full-text search** — extend search to URLs and notes, not just link names

Fork the repo, create a branch, and open a pull request.
