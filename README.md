# SacStudentTrade

A marketplace web application for Sacramento State students to buy and sell items on campus.

## Tech Stack

**Backend:** Java 17, Spring Boot 3, Spring Security (JWT), Hibernate, Flyway, PostgreSQL  
**Frontend:** React 18, Vite, Chakra UI (toasts), Custom CSS Design System  
**Deployment:** Render (backend & frontend), Supabase (PostgreSQL)

## Features

- **Authentication** — Signup, login, and JWT-based session management
- **Marketplace** — Browse, search, filter by category, and sort listings
- **Post Items** — List items for sale with title, description, price, category, and image upload
- **Favorites** — Save and manage favorite listings
- **Messaging** — Inbox with threaded conversations between buyers and sellers

## Project Structure

```
├── backend/
│   ├── src/main/java/com/amigoscode/
│   │   ├── auth/           # Login & registration endpoints
│   │   ├── customer/       # User profiles & management
│   │   ├── item/           # Item listings CRUD
│   │   ├── message/        # Messaging system
│   │   ├── favorite/       # Favorites system
│   │   ├── jwt/            # JWT authentication filter
│   │   └── s3/             # Image upload (AWS S3)
│   └── src/main/resources/
│       ├── application.yml          # Local config
│       ├── application-prod.yml     # Production config
│       └── db/migration/            # Flyway SQL migrations
│
├── frontend/react/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/        # Login, Signup, BrandPanel
│   │   │   ├── marketplace/ # MarketplacePage, ItemCard, ItemDetail, SellPage
│   │   │   ├── messages/    # MessagesPage (inbox + threads)
│   │   │   ├── layout/      # Navbar
│   │   │   └── shared/      # Icons, StatusBadge, ProtectedRoute
│   │   ├── context/         # AuthContext (JWT + user state)
│   │   ├── services/        # API client & utilities
│   │   └── styles/          # Global CSS design system
│   └── vite.config.js
```

## Running Locally

### Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- PostgreSQL 15+

### Backend

```bash
cd backend
mvn spring-boot:run
```

Runs on `http://localhost:8080`. Requires a local PostgreSQL instance (see `application.yml` for connection details).

### Frontend

```bash
cd frontend/react
npm install
npm run dev
```

Runs on `http://localhost:5173`. Proxied to backend via Vite config.

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/auth/login` | Login |
| POST | `/api/v1/customers` | Register |
| GET | `/api/v1/items` | List all items |
| POST | `/api/v1/items` | Create item |
| POST | `/api/v1/items/{id}/image` | Upload item image |
| GET | `/api/v1/messages/user/{id}` | Get user's messages |
| POST | `/api/v1/messages` | Send message |
| GET | `/api/v1/favorites/customer/{id}` | Get favorites |
| POST | `/api/v1/favorites` | Add favorite |

## Deployment

- **Backend**: Render Web Service (Docker) → `https://sactrade-api.onrender.com`
- **Frontend**: Render Static Site → connected via `VITE_API_BASE_URL`
- **Database**: Supabase PostgreSQL (session pooler, port 5432)

## Authors

Built for CSC 131 — Sacramento State
