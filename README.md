
# YouTube Clone

A full-stack YouTube clone project with separate backend (Node.js, Express, MongoDB) and frontend (React, Vite, TailwindCSS, ShadCN UI components) applications.

## Features

- User authentication (JWT, refresh tokens)
- Video upload, streaming, and management
- Comments, likes, playlists, tweets, and subscriptions
- Cloudinary integration for media storage
- RESTful API with secure routes

## Getting Started

1. Clone the repo and install dependencies in both `backend` and `frontend` folders.
2. Copy `.env.example` to `.env.local` in each folder and set your environment variables.
3. Start the backend:
   ```sh
   cd backend
   npm install
   npm run dev
   ```
4. Start the frontend:
   ```sh
   cd frontend
   npm install
   npm run dev
   ```

## Folder Structure

- `backend/` — Express API, MongoDB models, controllers, and routes
- `frontend/` — React app (Vite), UI components