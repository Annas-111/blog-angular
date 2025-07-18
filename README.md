# 📰 Blog App – Angular + NestJS

This is a full-stack blog application built with **Angular 17** (Sakai-NG + PrimeNG) and **NestJS + PostgreSQL**. It features **passwordless email OTP authentication**, protected routes, and a responsive UI for viewing and creating blog posts.

---

## 🚀 Features

### 🖥️ Frontend (Angular 17 + Sakai-NG + PrimeNG)

- ✅ Home Page with paginated AG Grid
- ✅ Post Detail Page
- ✅ Create Post (Authenticated)
- ✅ Login / Register via Email OTP (Passwordless)
- ✅ PrimeNG responsive layout and components
- ✅ Profile dropdown after login
- ✅ Route protection via Auth Guards
- ✅ Angular Signals for state management & loading states
- ✅ Form validation for OTP and post creation

### 🔧 Backend (NestJS + PostgreSQL)

- ✅ Register & Login via Email OTP
- ✅ JWT-based Authentication for secure routes
- ✅ Public API routes secured via `x-api-key`
- ✅ Posts API:
  - Get paginated posts: `GET /posts?page=1`
  - Get post by ID: `GET /posts/:id`
  - Create post (auth required): `POST /posts`
- ✅ PostgreSQL with TypeORM
- ✅ Author-Post relational mapping

---

## 🔐 Auth Flow

1. **Register/Login**:
   - User submits email.
   - Server sends a 6-digit OTP to that email.
   - User enters the OTP for verification.
   - On success, a JWT is issued and stored in the frontend.

2. **Frontend Session**:
   - JWT is stored using Angular Signals.
   - All protected routes and API calls use the JWT via `Authorization` header.

3. **Post Creation**:
   - Requires a valid JWT.
   - Authenticated user is set as the author of the post.

---

## 🧪 Tech Stack

| Layer     | Stack                                      |
|-----------|--------------------------------------------|
| Frontend  | Angular 17, PrimeNG, Sakai-NG, AG Grid     |
| Backend   | NestJS, TypeORM, PostgreSQL, Passport-JWT  |
| Auth      | Email-based OTP (Passwordless), JWT        |
| UI        | PrimeNG with responsive layouts            |
| State     | Angular Signals                            |

---

## 🔧 Setup Instructions

### 🖥️ Frontend Setup

```bash
cd frontend
npm install
npm run dev  # or ng serve
