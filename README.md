# 📚 OnlineBookApi

A full-stack book lending platform built with Clean Architecture principles, enabling users to share and borrow books from each other's personal collections.

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

## ✨ Features

- **User Management**
  - Email/password registration and authentication
  - Google OAuth integration
  - JWT-based secure sessions
  - User profile management

- **Book Management**
  - Add books to your personal collection
  - Upload book cover images (AWS S3 integration)
  - Search books by title
  - View detailed book information
  - Update and delete your books

- **Booking System**
  - Reserve books for specific date ranges
  - View booking calendar with unavailable dates
  - Email notifications for successful bookings
  - Booking history tracking

- **Contact System**
  - Contact form for user inquiries
  - Email notifications to administrators

## 🛠️ Tech Stack

### Backend
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type-safe JavaScript
- **TypeORM** - ORM for database management
- **MySQL 8** - Relational database
- **JWT** - Authentication tokens
- **Passport** - Authentication middleware
- **Bcrypt** - Password hashing
- **AWS S3** - File storage for book covers
- **Nodemailer** - Email service

### Frontend
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool
- **Material-UI (MUI)** - Component library
- **React Router** - Client-side routing
- **React Query (TanStack Query)** - Server state management
- **React Hook Form** - Form management
- **Yup** - Form validation
- **Axios** - HTTP client

### DevOps
- **Docker & Docker Compose** - Containerization
- **Husky** - Git hooks
- **Commitlint** - Commit message linting
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Jest** - Testing framework

## 📋 Prerequisites

- **Node.js** 20.x or higher
- **npm** or **yarn**
- **Docker** and **Docker Compose** (for containerized development)
- **MySQL 8** (if running without Docker)
- **AWS Account** (for S3 file uploads)
- **Google Cloud Console** (for OAuth, optional)

## 🚀 Getting Started

### Option 1: Docker (Recommended)

The easiest way to get started is using Docker Compose:

1. **Clone the repository**
   ```bash
   git clone git@github.com:CDjepeno/OnlineBookApi.git
   cd OnlineBookApi
   ```

2. **Set up environment variables**
   ```bash
   # Copy the Docker environment template
   cp .env.docker.example .env.docker

   # Edit .env.docker and add your credentials
   # (AWS keys, email settings, JWT secret, etc.)
   ```


3. **Start all services**
   ```bash
   docker-compose build
   
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000/docs
   - MySQL: localhost:3307

5. **View logs**
   ```bash
   docker-compose logs -f
   ```

The database will be automatically seeded with sample data on first startup.

### Option 2: Local Development

1. **Clone the repository**
   ```bash
   git clone git@github.com:CDjepeno/OnlineBookApi.git
   cd OnlineBookApi
   ```

2. **Install root dependencies**
   ```bash
   npm install
   ```

3. **Set up Backend**
   ```bash
   cd apps/nest
   npm install

   # Copy environment template
   cp .env.dist .env

   # Edit .env with your configuration
   nano .env

   # Run migrations
   npm run migration:run

   # (Optional) Load sample data
   npm run fixtures:load
   ```

4. **Set up Frontend**
   ```bash
   cd apps/client-react
   npm install
   ```

5. **Start MySQL**
   ```bash
   # Using Docker
   docker run -d \
     --name mysql-book \
     -e MYSQL_ROOT_PASSWORD=Bonjour_12@ \
     -e MYSQL_DATABASE=book_db \
     -e MYSQL_USER=book_user \
     -e MYSQL_PASSWORD=Bonjour_12@ \
     -p 3307:3306 \
     mysql:8

   # Or use your local MySQL installation
   ```

6. **Run the applications**
   ```bash
   # Terminal 1 - Backend
   cd apps/nest
   npm run start:dev

   # Terminal 2 - Frontend
   cd apps/client-react
   npm run dev
   ```

7. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000 (or your configured port)

## 🏗️ Project Structure

```
OnlineBookApi/
├── apps/
│   ├── nest/                 # Backend (NestJS)
│   │   ├── src/
│   │   │   ├── domaine/      # Business logic (Clean Architecture)
│   │   │   │   ├── user/     # User domain
│   │   │   │   ├── book/     # Book domain
│   │   │   │   ├── booking/  # Booking domain
│   │   │   │   └── contact/  # Contact domain
│   │   │   └── infras/       # Infrastructure layer
│   │   │       ├── controllers/  # HTTP controllers
│   │   │       ├── services/     # Repository implementations
│   │   │       ├── models/       # TypeORM entities
│   │   │       ├── clients/      # External services (S3, Email)
│   │   │       └── common/       # Guards, filters, decorators
│   │   └── test/             # Tests
│   │
│   └── client-react/         # Frontend (React)
│       ├── src/
│       │   ├── pages/        # Page components
│       │   ├── components/   # Reusable components
│       │   ├── services/     # API services
│       │   ├── request/      # API client configuration
│       │   ├── context/      # React contexts
│       │   └── types/        # TypeScript types
│       └── public/           # Static assets
│
├── docker-compose.yml        # Docker orchestration
├── CLAUDE.md                 # AI assistant documentation
└── README.md                 # This file
```

## 📄 License

This project is private and proprietary. All rights reserved.

## 👥 Team

Developed by the CDjepeno team.

## 🔗 Links

- [Repository](https://github.com/CDjepeno/OnlineBookApi)
- [Issue Tracker](https://github.com/CDjepeno/OnlineBookApi/issues)
- [Architecture Documentation](./CLAUDE.md)

---

**Happy coding!** 🚀
