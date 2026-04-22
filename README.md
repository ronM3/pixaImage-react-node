# PixaImage

A photo gallery built on the Pixabay API — browse, filter, search, and view photos in a clean masonry layout with light and dark modes.

Live at [pixaimage.onrender.com](https://pixaimage.onrender.com/)

## Stack

React 18 with Vite on the frontend, Redux Toolkit for state, Express on the backend with an in-memory cache to keep Pixabay request counts down. Styled with plain CSS and a small token system — no Tailwind, no CSS-in-JS, no UI library.

## Running locally

You'll need a free [Pixabay API key](https://pixabay.com/api/docs/).

Backend:

```bash
cd backend
npm install
# create .env with: API_ENDPOINT=https://pixabay.com/api/?key=YOUR_KEY
npm start
```

Frontend:

```bash
cd frontend
npm install
# create .env with: VITE_LOCALHOST=http://localhost:5000/photos
npm run dev
```

Frontend runs on port 3000, backend on 5000.

## Structure

The backend is layered — controllers handle HTTP, services do orchestration, service-agents talk to Pixabay and own the cache. The frontend is component-based with Redux handling photo state and async thunks for API calls.

```text
backend/
  controllers/       HTTP handlers
  services/          Orchestration
  servicesAgents/    Pixabay + cache
  helpers/           Sort + pagination math
  middlewares/       Pagination, errors
  server.js

frontend/src/
  components/        Header, PhotosContainer, ImageCard, PhotoLightbox, etc.
  redux/features/    photosSlice and photosAction
  assets/styles/     Per-component CSS + design tokens
  App.jsx
```

## What it does

Photos load 9 at a time into a CSS-columns masonry grid that respects each image's native aspect ratio. Ten category chips filter results inline; search is debounced and goes through the backend's `?q=` param. Clicking a photo opens a lightbox with the full-size image, photographer info, view/download/like/collection stats, and tag pills. Keyboard navigation works — arrow keys page through photos, Escape closes.

The backend caches each category+query combination for 60 seconds in memory, so pagination and repeated filtering don't hammer Pixabay.

Dark mode follows system preference on first load, persists to localStorage, and can be toggled manually from the header.

## Deployment

Deployed on Render — backend as a web service, frontend as a static site built from `frontend/dist/`. Environment variables on the platform mirror the local `.env` files. No Docker, no CI config; Render auto-deploys on push to `main`.

## Author

Built by [Ron Motola](https://motoladev.com).
