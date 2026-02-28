# 🔒 Link Vault

A full-stack link management app. Save URLs, organise them into collections, and search across them — from the web app or directly from any page you're browsing via the Chrome Extension.

---

## How the Code Works

### Frontend (`/frontend`)
Built with React 19 and Vite. All state lives in `App.jsx` and flows down to components via props — no Redux or Context, just straightforward prop drilling since the app is small enough that it stays manageable.

**`src/api.js`** — every single fetch call to the backend lives here. One file, one place to change the base URL. Uses `import.meta.env.VITE_API_URL` so the backend URL is set via environment variable and never hardcoded.

**`src/App.jsx`** — root component. Holds all state: links, collections, active filters, modal visibility, search term. All handlers (add, edit, delete, filter) live here and get passed down as props.

**`src/components/`**
- `Header.jsx` — search input and the add link button
- `sidebar.jsx` — navigation between home and collections, add collection button. Collapses to a bottom bar on mobile.
- `linklist.jsx` — renders the list of link cards with edit and delete buttons
- `collectionPage.jsx` — shows all collections with their real link counts
- `addlinkbtn.jsx` — modal for adding or editing a link, includes collection assignment
- `addcollectionbtn.jsx` — modal for creating a new collection

### Backend (`/backend`)
Node.js with Express 5, ES Modules throughout. Two route files handle all CRUD operations. Data is stored in a flat JSON file — no database dependency.

**`server.js`** — entry point. Sets up CORS (allows the frontend origin and any `chrome-extension://` origin), registers the two route files, starts the server on `process.env.PORT` so it works on Render.

**`routes/links.js`** — handles all `/links` endpoints. Important: the `/unassigned` and `/collection/:id` routes are defined before `/:id` so Express does not swallow them as ID parameters.

**`routes/collections.js`** — handles all `/collections` endpoints.

**`data/db.js`** — two functions: `readData()` and `writeData()`. Reads and writes `data.json` using Node's `fs/promises`. All routes import these instead of touching the file directly.

**`data/data.json`** — the database. Stores `{ links: [], collections: [] }`.

### Chrome Extension (`/extension`)
Manifest V3. When you click the icon it auto-fills the current tab's title and URL, loads your collections from the backend into a dropdown, and POSTs the new link on save. Talks to the exact same backend as the web app.

**`manifest.json`** — declares `activeTab` permission to read the current tab, and `host_permissions` to allow fetch calls to the backend (required in Manifest V3 — without this Chrome blocks all requests silently).

**`popup.js`** — all the extension logic. Checks if the server is reachable on open, loads collections, handles the save.

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
│   │   ├── db.js
│   │   └── data.json
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
- A Chromium-based browser (Chrome, Edge, Brave) for the extension

### 1. Backend

```bash
cd backend
npm install
node server.js
```

Server runs on `http://localhost:5000`. You should see:
```
Server running on port 5000
```

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

App runs on `http://localhost:5173`.

Create a `.env` file inside the `frontend/` folder:
```
VITE_API_URL=http://localhost:5000
```

### 3. Chrome Extension

1. Open `chrome://extensions` in your browser
2. Enable **Developer Mode** (toggle in the top right)
3. Click **Load unpacked**
4. Select the `extension/` folder

The Link Vault icon will appear in your toolbar. Make sure the backend is running before using it.

---

## Environment Variables

### Frontend (`frontend/.env`)
| Variable | Value |
|---|---|
| `VITE_API_URL` | Backend URL — `http://localhost:5000` locally, your Render URL in production |

### Backend
| Variable | Value |
|---|---|
| `FRONTEND_URL` | Your deployed frontend URL — used for CORS in production |
| `PORT` | Set automatically by Render, falls back to 5000 locally |

---

## Deployment

### Backend → Render
1. Push to GitHub
2. Render → New Web Service → connect repo
3. Set Root Directory to `backend`
4. Build command: `npm install` — Start command: `node server.js`
5. Add environment variable: `FRONTEND_URL` = your Vercel URL

### Frontend → Vercel
1. Vercel → New Project → connect repo
2. Set Root Directory to `frontend`
3. Framework preset: Vite — Build command: `npm run build` — Output: `dist`
4. Add environment variable: `VITE_API_URL` = your Render URL
5. Deploy

### Extension (production)
Update the `API_URL` constant at the top of `popup.js` to your Render URL, then reload the extension in `chrome://extensions`.
