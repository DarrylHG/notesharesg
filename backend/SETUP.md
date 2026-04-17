# NoteShare Backend Setup Instructions

## 1. Install dependencies

Open a terminal in the `backend/` folder and run:

```
npm install
```

## 2. Configure environment variables

- Copy `.env.example` to `.env` in the `backend/` folder.
- Fill in your PostgreSQL connection string and Google OAuth credentials.

## 3. Set up the database

- Make sure your PostgreSQL server is running and accessible.
- Run Prisma migrations to create tables:

```
npx prisma migrate dev --name init
```

## 4. Generate Prisma client

```
npx prisma generate
```

## 5. Start the backend server

```
npm run dev
```

The backend will run on `http://localhost:5000` by default.

## 6. Connect your frontend

- Update your frontend API URLs to point to `http://localhost:5000/api`.
- For authentication, send the JWT token in the `Authorization: Bearer <token>` header for protected routes.
- For file uploads, use `multipart/form-data` with a `file` field (PDF only).

---

**API Endpoints:**
- `POST /api/auth/signup` — Email/password signup
- `POST /api/auth/signin` — Email/password signin
- `GET /api/auth/google` — Google OAuth login
- `POST /api/notes` — Upload a note (PDF)
- `GET /api/notes` — List all notes
- `GET /api/notes/:id` — Get a note
- `POST /api/comments` — Add comment
- `GET /api/comments/note/:noteId` — Get comments for a note
- `GET /api/users/me` — Get current user profile (JWT required)

---

**You are ready to go!**
