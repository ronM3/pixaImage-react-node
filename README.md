# PixaImage — Full Stack Photo Gallery

A full-stack photo discovery app powered by the [Pixabay API](https://pixabay.com/api/docs/). Browse, filter by category, paginate, and inspect high-quality photos — all with a responsive React frontend backed by a layered Node.js/Express API.

**Live demo:** https://pixaimage.onrender.com/

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture Overview](#architecture-overview)
- [Project Structure](#project-structure)
- [Application Flow](#application-flow)
- [API Reference](#api-reference)
- [Redux State Shape](#redux-state-shape)
- [Caching Strategy](#caching-strategy)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)

---

## Features

| Feature | Description |
|---|---|
| Photo browsing | Displays 9 photos per page from Pixabay |
| Category filtering | Filter by All, Backgrounds, Fashion, Nature, Science, Animals, Education, Feelings, Health, or Food |
| Pagination | Previous / Next navigation with `hasNextPage` / `hasPrevPage` guards |
| Sort by ID | Ascending or descending by Pixabay photo ID |
| Sort by Date | Ascending or descending by upload date |
| Photo details | Click any photo to see Views, Downloads, Collections, and Likes |
| In-memory caching | 60-second server-side cache per category to reduce Pixabay API calls |
| Responsive UI | Mobile hamburger menu; scroll-aware sticky header |
| Loading feedback | Animated spinner during all API requests |

---

## Tech Stack

### Frontend
- **React 18** + **Vite** — component-based UI with fast HMR
- **Redux Toolkit** — centralized state management (`createSlice`, `configureStore`)
- **react-redux** — React bindings for the Redux store
- **react-modal** — accessible modal dialog
- **react-loader-spinner** — animated loading indicator

### Backend
- **Node.js** + **Express 4** — HTTP server and routing
- **Axios** — HTTP client for Pixabay API requests
- **memory-cache** — lightweight in-memory response caching
- **cors** — configurable cross-origin resource sharing
- **dotenv** — environment variable management

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (React)                       │
│                                                              │
│  Header → PhotosContainer → ImageCard × 9                   │
│               ↕ Redux Dispatch                               │
│           photosSlice (Redux Toolkit)                        │
│               ↕ HTTP (fetch/axios)                           │
└──────────────────────────┬──────────────────────────────────┘
                           │ REST API calls
┌──────────────────────────▼──────────────────────────────────┐
│                  Express Backend                              │
│                                                              │
│  Route (/photos)                                             │
│    → paginationMiddleware                                    │
│    → Controller (photosController.js)                        │
│    → Service      (photosService.js)                         │
│    → ServiceAgent (photosSA.js)                              │
│         ↕ memory-cache (60s TTL)                             │
│    → SAHelper.getAsync()                                     │
│         ↕ HTTP GET                                           │
└──────────────────────────┬──────────────────────────────────┘
                           │
                ┌──────────▼──────────┐
                │   Pixabay API        │
                │  (200 photos/call)   │
                └─────────────────────┘
```

**Layered backend pattern:**
1. **Controller** — HTTP in/out, reads `req.pagination`, calls Service, sends JSON response
2. **Service** — thin orchestration layer; delegates to ServiceAgent
3. **ServiceAgent** — owns Pixabay API integration and the cache
4. **Helpers** — pure utility functions (sorting, pagination math, HTTP wrapper)

---

## Project Structure

```
pixaImage-react-node/
├── backend/
│   ├── controllers/
│   │   └── photosController.js     # Route handlers
│   ├── services/
│   │   └── photosService.js        # Business logic orchestration
│   ├── servicesAgents/
│   │   └── photosSA.js             # Pixabay API calls + caching
│   ├── helpers/photos/
│   │   ├── SAHelpers.js            # HTTP wrapper, cache handler
│   │   └── serviceHelper.js        # Sorting & pagination calculations
│   ├── middlewares/
│   │   ├── paginationMiddleware.js # Extracts ?page param
│   │   └── errorHandler.js         # Global error handler
│   ├── server.js                   # Express app entry point
│   ├── Procfile                    # Heroku/Render process definition
│   └── .env                        # Backend env vars (not committed)
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.jsx           # Navbar, scroll detection, mobile menu
    │   │   ├── PhotosContainer.jsx  # Main layout, state wiring, modal control
    │   │   ├── ImageCard.jsx        # Single photo card
    │   │   ├── ButtonsContainer.jsx # Prev/Next pagination buttons
    │   │   ├── TypeSelectModal.jsx  # Dual-purpose modal (category | photo detail)
    │   │   ├── LoadingSpinner.jsx   # Blocks spinner
    │   │   └── Footer.jsx           # Copyright footer
    │   ├── redux/features/photos/
    │   │   ├── photosSlice.js       # State shape + reducers
    │   │   └── photosAction.js      # Async thunks (fetchPhotos, prev/next page)
    │   ├── store.js                 # Redux store configuration
    │   ├── App.jsx                  # Root component
    │   └── main.jsx                 # ReactDOM entry point
    ├── vite.config.js               # Vite dev server (port 3000)
    └── .env                         # Frontend env vars (not committed)
```

---

## Application Flow

### Initial Load
1. React mounts; `PhotosContainer` dispatches `fetchPhotos()` on `useEffect`
2. Redux thunk makes `GET /photos?page=1` to the backend
3. Backend checks memory cache → miss on first request → calls Pixabay API
4. Pixabay returns up to 200 photos; backend slices 9 for page 1 and returns pagination metadata
5. Redux stores the response; `PhotosContainer` renders the photo grid

### Category Selection
1. User clicks **Select Category** button in the header
2. `TypeSelectModal` opens in *category mode*, listing all categories
3. User selects a category (e.g., **Nature**)
4. Modal closes; `updateCurrentCategory('nature')` updates Redux state
5. `fetchPhotos('nature', 1)` is dispatched → `GET /photos?category=nature&page=1`
6. Backend caches the nature batch separately (`__express__photos__nature`)
7. Grid re-renders with filtered photos; page counter resets to 1

### Pagination
1. User clicks **Next** → `goToNextPage(category, currentPage)` dispatched
2. `GET /photos?category={cat}&page={n+1}` sent to backend
3. Backend slices the next 9 photos from cache (no new Pixabay call within 60s)
4. **Previous** button is disabled on page 1; **Next** disabled on the last page

### Photo Detail
1. User clicks any photo card
2. `TypeSelectModal` opens in *photo detail mode*
3. Displays: Views · Downloads · Collections · Likes

### Sorting (backend-only endpoints)
- `GET /photos/:category/sortById/:sortOrder` — numeric sort by Pixabay photo ID
- `GET /photos/:category/sortByDate/:sortOrder` — sort by upload date extracted from `userImageURL`
- Both return the same paginated response shape

---

## API Reference

All endpoints return JSON with the following shape:

```json
{
  "page": 1,
  "totalItems": 200,
  "totalPages": 23,
  "hasNextPage": true,
  "hasPrevPage": false,
  "items": [ /* photo objects */ ]
}
```

### Endpoints

| Method | Path | Query Params | Description |
|--------|------|-------------|-------------|
| `GET` | `/photos` | `category`, `page` | Paginated photos, optional category filter |
| `GET` | `/photos/:category/sortById/:sortOrder` | `page` | Sorted by Pixabay ID (`asc` / `desc`) |
| `GET` | `/photos/:category/sortByDate/:sortOrder` | `page` | Sorted by upload date (`asc` / `desc`) |

### Photo Object Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | number | Unique Pixabay photo identifier |
| `tags` | string | Comma-separated keywords |
| `largeImageURL` | string | High-resolution display URL |
| `webformatURL` | string | Optimised web-size image URL |
| `user` | string | Photographer username |
| `userImageURL` | string | Photographer avatar URL (also encodes upload date) |
| `views` | number | Total view count |
| `downloads` | number | Total download count |
| `likes` | number | Total likes |
| `collections` | number | Times added to collections |

---

## Redux State Shape

```js
// store.photosState
{
  data: {
    page: number,           // current page
    totalItems: number,     // total photos for this category
    totalPages: number,
    hasNextPage: boolean,
    hasPrevPage: boolean,
    items: Photo[]          // current page of photos
  },
  loading: boolean,
  error: string | null,
  currentPage: number,
  currentCategory: string | null
}
```

**Actions dispatched by components:**

| Action creator | Triggered by |
|---|---|
| `fetchPhotos(category, page)` | Mount, category change |
| `goToNextPage(category, page)` | Next button click |
| `goToPrevPage(category, page)` | Previous button click |
| `updateCurrentCategory(category)` | Category modal selection |

---

## Caching Strategy

The backend uses `memory-cache` to avoid redundant Pixabay API calls:

- **Key format:** `__express__photos__{category}` (e.g., `__express__photos__nature`)
- **TTL:** 60 seconds
- **Scope:** All 200 photos for a category are cached as one entry; pagination is computed on the cached array
- **Invalidation:** TTL-based only — cache is automatically cleared after 60 seconds

This means the first request for each category hits Pixabay; subsequent requests within the TTL window are served from memory with no external call.

---

## Getting Started

### Prerequisites

- Node.js ≥ 16
- A free [Pixabay API key](https://pixabay.com/api/docs/)

### 1. Clone the repository

```bash
git clone https://github.com/ronM3/pixaImage-react-node.git
cd pixaImage-react-node
```

### 2. Set up the backend

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
NODE_ENV=development
API_ENDPOINT=https://pixabay.com/api/?key=YOUR_PIXABAY_API_KEY
```

Start the server:

```bash
npm start        # node server.js on port 5000
```

### 3. Set up the frontend

```bash
cd ../frontend
npm install
```

Create `frontend/.env`:

```env
VITE_PIXABAY=https://your-deployed-backend.onrender.com/photos
VITE_LOCALHOST=http://localhost:5000/photos
```

Start the dev server:

```bash
npm run dev      # Vite on http://localhost:3000
```

### 4. Build for production

```bash
cd frontend
npm run build    # outputs to frontend/dist/
```

---

## Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|---|---|
| `NODE_ENV` | `development` or `production` |
| `API_ENDPOINT` | Pixabay API base URL including your API key |
| `PORT` | Server port (defaults to `5000`; set automatically by hosting platforms) |

### Frontend (`frontend/.env`)

| Variable | Description |
|---|---|
| `VITE_PIXABAY` | Production backend API URL |
| `VITE_LOCALHOST` | Local development backend URL |

> The active URL is selected in `photosAction.js` based on which variable is imported.

---

## Deployment

### Backend — Render / Heroku

The `Procfile` in `backend/` defines the process:

```
web: node server
```

Set the following environment variables on your hosting platform:
- `NODE_ENV=production`
- `API_ENDPOINT=https://pixabay.com/api/?key=YOUR_KEY`

### Frontend — Static Hosting

Run `npm run build` in the `frontend/` directory and deploy the `dist/` folder to any static host (Render Static Site, Vercel, Netlify, GitHub Pages, etc.).

Update `VITE_PIXABAY` to point to your deployed backend URL before building.

---

## Author

Ron Motola — [GitHub @ronM3](https://github.com/ronM3)
