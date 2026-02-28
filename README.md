# 🔒 Link Vault

A full-stack link management web app with a companion Chrome Extension. Save, organise, and retrieve links across collections — from the browser or directly from any webpage you're visiting.

---

## What It Does

Link Vault lets you save URLs with a name and optional notes, group them into collections, search across your saved links, and manage everything from a clean web interface. The Chrome Extension lets you save any page you're currently on with one click — your collections load automatically in the popup so you can assign the link right away.

---

## System Architecture

```
┌─────────────────────────┐       ┌──────────────────────────┐
│   Chrome Extension      │       │   React Frontend (Vite)  │
│   manifest v3           │       │   Vercel                 │
│   popup.html / popup.js │       │   App.jsx + components   │
└────────────┬────────────┘       └────────────┬─────────────┘
             │  HTTP POST /links               │  HTTP GET/POST/PUT/DELETE
             │  HTTP GET  /collections         │  /links  /collections
             └──────────────┬──────────────────┘
                            │
               ┌────────────▼─────────────┐
               │   Express Backend        │
               │   Node.js + Express 5    │
               │   Render (free tier)     │
               │                          │
               │   Routes:                │
               │   /links    (CRUD)       │
               │   /collections (CRUD)    │
               └────────────┬─────────────┘
                            │  fs/promises read/write
               ┌────────────▼─────────────┐
               │   data.json              │
               │   Flat-file database     │
               │   { links[], collections[] } │
               └──────────────────────────┘
```

**Frontend** — React 19 + Vite, plain CSS with CSS custom properties, no UI library. Component-based layout with a collapsible sidebar, modal system for adding/editing, and live search filtering.

**Backend** — Node.js with Express 5, ES Modules. RESTful API with two route files (`links.js`, `collections.js`). Data is persisted to a local `data.json` file via `fs/promises`.

**Chrome Extension** — Manifest V3 extension. Auto-fills the current tab's title and URL into the popup, loads your collections from the backend, and POSTs the new link on save.

**Communication** — All three pieces talk to the same backend over HTTP. CORS is configured to allow the frontend origin, any `chrome-extension://` origin, and the local dev server.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite 7, plain CSS |
| Backend | Node.js, Express 5, ES Modules |
| Database | JSON flat-file (`fs/promises`) |
| Extension | Chrome Manifest V3, vanilla JS |
| Deployment | Vercel (frontend), Render (backend) |

---

## Features

- Add, edit, and delete links with a name, URL, and notes
- Organise links into named collections
- Filter links by collection via the sidebar
- Live search across link names
- Chrome Extension to save the current tab in one click
- Collections load in the extension popup for instant assignment
- Responsive layout — sidebar collapses to a bottom nav on mobile
- Loading spinner while data fetches from the backend
- Graceful error handling if the server is unreachable

---

## Project Structure

```
link-vault/
├── frontend/               # React + Vite app
│   ├── src/
│   │   ├── App.jsx         # Root component, all state lives here
│   │   ├── api.js          # All fetch calls to the backend
│   │   └── components/
│   │       ├── Header.jsx          # Search bar + add button
│   │       ├── sidebar.jsx         # Nav: home, collections, add
│   │       ├── linklist.jsx        # Renders the link cards
│   │       ├── collectionPage.jsx  # Collections overview
│   │       ├── addlinkbtn.jsx      # Add/edit link modal
│   │       └── addcollectionbtn.jsx# Add collection modal
│   └── .env                # VITE_API_URL
│
├── backend/                # Express API
│   ├── server.js           # Entry point, CORS, middleware
│   ├── routes/
│   │   ├── links.js        # GET/POST/PUT/DELETE /links
│   │   └── collections.js  # GET/POST/PUT/DELETE /collections
│   └── data/
│       ├── db.js           # readData / writeData helpers
│       └── data.json       # Persistent storage
│
└── extension/              # Chrome Extension
    ├── manifest.json
    ├── popup.html
    ├── popup.js
    └── style.css
```

---

## Running Locally

**Backend**
```bash
cd backend
npm install
node server.js
# Running on http://localhost:5000
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

**Extension**
1. Open `chrome://extensions`
2. Enable Developer Mode
3. Click "Load unpacked" → select the `extension/` folder

---

## Deployment

| Piece | Platform | Notes |
|---|---|---|
| Frontend | Vercel | Auto-detects Vite. Set `VITE_API_URL` env var to your Render URL |
| Backend | Render | Set `FRONTEND_URL` env var to your Vercel URL. Free tier sleeps after 15min inactivity |
| Extension | Local / Chrome Web Store | Update `API_URL` in `popup.js` to your Render URL before publishing |

---

## Possible Future Additions

**Short term**
- Tag system — add freeform tags to links for cross-collection filtering
- Favicon fetching — display the site's favicon next to each link
- Link health checker — periodically ping saved URLs and flag broken ones
- Import/export — export all links as JSON or CSV, import from browser bookmarks

**Medium term**
- User authentication — accounts so multiple users can have separate vaults
- Real database — swap the JSON flat-file for PostgreSQL or SQLite for reliability and concurrent access
- Browser history integration — suggest links from your history to save
- Collections sharing — share a collection via a public read-only link

**Long term**
- Full-text search — index page content at save time so you can search by what's on the page, not just the title
- Browser support — port the extension to Firefox and Safari
- Mobile app — React Native companion app
- AI-powered auto-tagging — suggest collections and tags based on page content
