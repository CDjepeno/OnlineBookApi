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
   docker-compose up -d
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
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

## 📝 Environment Variables

### Backend (`.env` in `apps/nest/`)

```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=book_user
DB_PASSWORD=your_password
DB_NAME=book_db

# JWT
JWT_SECRET=your-super-secret-jwt-key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_key
AWS_SECRET_ACCESS_KEY=your_aws_secret
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name

# Email (SMTP)
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=your-email@gmail.com
MAIL_PASSWORD=your-app-password

# Google OAuth (optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Features
LOAD_FIXTURES=true
NODE_ENV=development
```

See `apps/nest/.env.dist` for a complete template.

## 🧪 Testing

### Backend Tests

```bash
cd apps/nest

# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov

# Run specific test suites
npm run test:unitaire      # Unit tests
npm run test:integration   # Integration tests
npm run test:e2e           # End-to-end tests
```

### Test Structure

The backend follows a clean testing strategy:
- **Unit Tests**: Test use cases in isolation with mocked dependencies
- **Integration Tests**: Test repository and database interactions
- **E2E Tests**: Test complete API endpoints

## 📚 API Documentation

The API follows RESTful conventions and is organized by domain:

### Authentication
- `POST /user/register` - Register new user
- `POST /user/login` - Login with email/password
- `POST /user/google-login` - Login with Google OAuth
- `GET /user/me` - Get current user info

### Books
- `GET /book` - Get all books (paginated)
- `GET /book/:id` - Get book details
- `GET /book/search/:name` - Search books by title
- `GET /book/user/:userId` - Get user's books
- `POST /book` - Create new book (authenticated)
- `PUT /book/:id` - Update book (authenticated)
- `DELETE /book/:id` - Delete book (authenticated)

### Bookings
- `POST /booking` - Create booking (authenticated)
- `GET /booking/user/:userId` - Get user's bookings
- `GET /booking/book/:bookId/dates` - Get booked dates for a book

### Contact
- `POST /contact` - Submit contact form

> For detailed API documentation, see the Swagger documentation at `http://localhost:8000/api` when running the backend.

## 🏛️ Architecture

This project follows **Clean Architecture** (Hexagonal Architecture) principles:

### Backend Architecture

- **Domain Layer** (`domaine/`): Pure business logic, framework-independent
  - Entities: Business objects
  - Repositories: Interface contracts
  - Use Cases: Business operations

- **Infrastructure Layer** (`infras/`): Technical implementation
  - Controllers: HTTP endpoints
  - Models: Database entities (TypeORM)
  - Services: Repository implementations
  - Clients: External services (AWS, Email)

**Key Benefits**:
- ✅ Testable business logic
- ✅ Framework independence
- ✅ Clear separation of concerns
- ✅ Easy to maintain and scale

See [CLAUDE.md](./CLAUDE.md) for detailed architecture documentation.

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### Commit Convention

This project uses **Commitlint** with a specific format:

```
<type>: <emoji> <ticket> <subject>

Example: feat: :sparkles: ON-236 add user profile page
```

**Types**: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`

**Emojis**:
- `:sparkles:` - New features
- `:bug:` - Bug fixes
- `:hammer:` - Refactoring/chores

**Ticket**: `ON-XXX` format

### Development Workflow

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/ON-XXX-amazing-feature`)
3. Make your changes
4. Run tests (`npm test`)
5. Run linters (`npm run lint:all`)
6. Commit with proper format
7. Push to your fork
8. Open a Pull Request

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Write **unit tests** for business logic
- Keep **domain logic** separate from infrastructure
- Document complex logic with comments

## 🐛 Troubleshooting

### Docker Issues

**Ports already in use:**
```bash
# Check what's using the port
lsof -i :8000
lsof -i :5173
lsof -i :3307

# Stop Docker Compose
docker-compose down

# Remove all containers and start fresh
docker-compose down -v
docker-compose up -d --build
```

**Database connection issues:**
```bash
# Check MySQL health
docker-compose exec mysql-db mysqladmin ping -h localhost -ubook_user -p

# View MySQL logs
docker-compose logs mysql-db

# Reset database
docker-compose down -v
docker-compose up -d
```

### Common Issues

**TypeORM synchronize issues:**
- In development, TypeORM auto-synchronizes schema
- For production, use migrations: `npm run migration:generate`

**AWS S3 upload fails:**
- Verify AWS credentials in `.env`
- Check bucket permissions
- Ensure bucket region matches configuration

**Email not sending:**
- For Gmail, use App Passwords (not your regular password)
- Enable "Less secure app access" if needed
- Check SMTP settings

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
