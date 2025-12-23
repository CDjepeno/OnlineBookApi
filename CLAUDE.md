# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OnlineBookApi is a full-stack book lending/booking platform built with **Clean Architecture** principles:
- **Backend**: NestJS (TypeScript) with strict domain/infrastructure separation
- **Frontend**: React + TypeScript with Vite
- **Database**: MySQL 8 with TypeORM
- **Infrastructure**: Docker Compose, AWS S3, Nodemailer, Google OAuth

This is a monorepo with two applications in `apps/`: `nest` (backend) and `client-react` (frontend).

## Development Commands

### Root Level
```bash
# Build
npm run build:nest           # Build NestJS backend
npm run build:react          # Build React frontend
npm run build:all           # Build both applications

# Lint
npm run lint:nest           # Lint NestJS code
npm run lint:react          # Lint React code
npm run lint:all           # Lint both applications
```

### NestJS Backend (`apps/nest/`)
```bash
cd apps/nest

# Development
npm run start:dev           # Hot reload (recommended)
npm run start:debug         # Debug mode with inspector
npm run start:prod          # Production mode

# Database
npm run migration:generate  # Generate migration from entity changes
npm run migration:create    # Create empty migration
npm run migration:run       # Run pending migrations
npm run migration:revert    # Revert last migration

# Fixtures & Seeding
npm run fixtures:load       # Load sample data (dev)
npm run fixtures:load:prod  # Load sample data (prod build)
npm run seed               # Run migrations + load fixtures

# Testing
npm run test               # All tests
npm run test:watch         # Tests in watch mode
npm run test:cov           # Tests with coverage report
npm run test:unitaire      # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e           # End-to-end tests only

# Code Quality
npm run format             # Format with Prettier
npm run lint               # ESLint with auto-fix
```

### React Frontend (`apps/client-react/`)
```bash
cd apps/client-react

npm run dev                # Start Vite dev server (port 5173)
npm run build              # TypeScript compile + production build
npm run preview            # Preview production build
npm run lint               # ESLint
```

### Docker
```bash
# Start/stop services
docker-compose up -d                    # Start all services in background
docker-compose down                     # Stop all services
docker-compose logs -f nest-api         # Follow NestJS logs
docker-compose logs -f client-react     # Follow React logs

# Access containers
docker-compose exec nest-api sh         # Shell into backend
docker-compose exec mysql-db mysql -ubook_user -pBonjour_12@ book_db

# Rebuild after changes
docker-compose up -d --build

# Services:
# - nest-api:      Backend API (port 8000)
# - client-react:  Frontend (port 5173)
# - mysql-db:      MySQL 8 (host port 3307 → container port 3306)
```

## Architecture

### Backend: Clean Architecture Pattern

The backend strictly separates **domain** (business logic) from **infrastructure** (technical implementation).

#### Domain Layer (`apps/nest/src/domaine/`)

Pure business logic, **framework-independent**. Contains 4 modules: `user`, `book`, `booking`, `contact`.

**Structure per module**:
```
domaine/{module}/
├── entities/              # Pure TypeScript classes (domain models)
├── repositories/          # Repository interfaces (contracts/ports)
└── usecases/             # Business logic use cases
    └── {usecase}/
        ├── {usecase}.usecase.ts     # Use case implementation
        ├── {usecase}.request.ts     # Input DTO
        └── {usecase}.response.ts    # Output DTO
```

**Key Pattern - Domain Entities**: Simple TypeScript classes, NO framework dependencies:
```typescript
// Domain entity - pure business object
export class BookEntity {
  constructor(
    readonly id: number,
    readonly title: string,
    readonly author: string,
    readonly releaseAt: Date,
    readonly coverUrl: string,
    readonly userId: number,
  ) {}
}
```

**Repository Pattern**: Domain defines **interfaces**, infrastructure implements:
```typescript
// Domain defines the contract
export interface BookRepository {
  addBook(book: BookEntity): Promise<void>;
  getAllBook(page: number, limit: number): Promise<[GetAllBookResponse[], number]>;
  getBooksByUser(userId: number): Promise<GetBooksByUserResponse[]>;
}
```

**Use Cases**: Single-responsibility business logic:
```typescript
export class AddBookUseCase {
  constructor(
    private readonly bookRepository: BookRepository,  // Domain interface
    private readonly awsS3Client: AwsS3Client,       // Infrastructure service
  ) {}

  async execute(request: AddBookRequest): Promise<AddBookResponse> {
    // Business logic here
    const coverUrl = await this.awsS3Client.uploadFile(request.coverUrl);
    const book = new BookEntity(...);
    await this.bookRepository.addBook(book);
    return { message: 'Votre livre a bien été créé' };
  }
}
```

#### Infrastructure Layer (`apps/nest/src/infras/`)

Framework-specific implementations that adapt the domain to NestJS, TypeORM, HTTP, etc.

**Key Components**:

1. **Models** (`infras/models/`): TypeORM entities (separate from domain entities)
```typescript
@Entity()
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @ManyToOne(() => User, user => user.books)
  user: User;

  @OneToMany(() => Booking, booking => booking.book)
  bookings: Booking[];
}
```

2. **Repository Implementations** (`infras/services/`): Implement domain interfaces
```typescript
export class BookRepositoryTypeorm implements BookRepository {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>,
  ) {}

  async addBook(bookEntity: BookEntity): Promise<void> {
    try {
      const book = new Book();
      // Map domain entity to ORM entity
      book.title = bookEntity.title;
      await this.bookRepository.save(book);
    } catch (error) {
      handleDatabaseError(error);  // Centralized error mapping
    }
  }
}
```

3. **Controllers** (`infras/controllers/`): One file per operation
```
controllers/
├── book/
│   ├── addBook/
│   │   ├── addBook.controller.ts
│   │   └── addBook.dto.ts
│   ├── getBook/
│   └── updateBook/
```

Controllers inject use cases via the UseCase Proxy:
```typescript
@Controller('book')
export class AddBookController {
  constructor(
    @Inject(UsecaseProxyModule.ADD_BOOK_USECASE_PROXY)
    private readonly addBookProxy: UseCaseProxy<AddBookUseCase>,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async addBook(@Body() dto: CreateBookDto, @UploadedFile() file) {
    return await this.addBookProxy.getInstance().execute({ ...dto, coverUrl: file });
  }
}
```

4. **UseCase Proxy Module** (`infras/usecase-proxy/usecase-proxy.module.ts`): **CENTRAL DI HUB**

This is the **wiring layer** that connects domain use cases with infrastructure implementations:
```typescript
@Module({
  imports: [RepositoriesModule, NodemailerModules, AwsS3Module],
})
export class UsecaseProxyModule {
  // Define tokens
  static ADD_BOOK_USECASE_PROXY = 'addBookUsecaseProxy';
  static GET_ALL_BOOKS_USECASE_PROXY = 'getAllBooksUsecaseProxy';

  static register(): DynamicModule {
    return {
      module: UsecaseProxyModule,
      providers: [
        {
          inject: [BookRepositoryTypeorm, AwsS3Client],
          provide: UsecaseProxyModule.ADD_BOOK_USECASE_PROXY,
          useFactory: (bookRepo, awsClient) =>
            new UseCaseProxy(new AddBookUseCase(bookRepo, awsClient)),
        },
        // ... all other use cases registered here
      ],
      exports: [/* all tokens */],
    };
  }
}
```

**IMPORTANT**: When adding a new use case, you MUST register it in `usecase-proxy.module.ts`.

5. **Common Infrastructure** (`infras/common/`):
```
common/
├── decorators/     # @CurrentUser(), @GoogleUser()
├── guards/         # JwtAuthGuard, GoogleAuthGuard
├── filters/        # Exception filters
├── interceptors/   # Request/response interceptors
└── errors/         # handleDatabaseError() - maps TypeORM errors to domain errors
```

6. **External Clients** (`infras/clients/`):
- `aws/`: AWS S3 client for file uploads
- `nodemailer/`: Email service
- `typeorm/`: TypeORM configuration module

#### Authentication Architecture

**JWT Strategy**:
1. User logs in → `LoginUserUseCase` validates credentials
2. Repository verifies bcrypt password, generates JWT with `JwtService`
3. Token stored in localStorage (client-side)
4. `JwtAuthGuard` validates token on protected routes
5. `@CurrentUser()` decorator extracts user from request

**Google OAuth**:
1. Frontend gets Google credential via `@react-oauth/google`
2. Sends to `GoogleLoginController`
3. `LoginGoogleUseCase` validates with Google, creates/retrieves user
4. Returns JWT token (same flow as email/password thereafter)

**Password Security**: Bcrypt hashing in TypeORM `@BeforeInsert()` hook (10 salt rounds)

#### Error Handling Strategy

**Centralized error management**:

1. **Domain Errors** (`domaine/errors/`): Custom exceptions extending `HttpException`
2. **Error Enum** (`domaine/enums/errors.enums.ts`): `USER_NOT_FOUND`, `DUPLICATE_EMAIL`, etc.
3. **Database Error Handler** (`infras/common/errors/errorsSwitch.ts`):
   - Maps TypeORM `QueryFailedError` to domain errors
   - Translates MySQL codes: `ER_DUP_ENTRY` → `DUPLICATE_EMAIL`
4. **Use Case Error Flow**: Catch repository errors, map to HTTP exceptions

#### Fixture System

**Automatic database seeding** on Docker startup:

1. `FixtureService` (`infras/fixtures/fixture.service.ts`): Creates sample users, books, bookings
2. `load-fixtures.ts`: Standalone bootstrap script
3. `docker-entrypoint.sh`: Waits for MySQL, then runs `npm run fixtures:load` if `LOAD_FIXTURES=true`
4. **Idempotent**: Checks if data exists before inserting

**Sample data**: 3 users (admin@example.com + test users), multiple books with S3 covers, bookings, contact messages.

### Frontend Architecture (React)

Feature-based organization with **separation of UI and logic**:

```
client-react/src/
├── pages/              # Feature modules
│   ├── user/
│   │   ├── Login/
│   │   └── Register/
│   ├── book/
│   │   ├── BookList/
│   │   ├── BookDetail/
│   │   └── BookForm/
│   │       └── BookAdd/
│   │           ├── BookAddForm.tsx      # UI component (presentation)
│   │           └── BookAdd.hook.ts      # Logic hook (state, API, forms)
│   ├── booking/
│   ├── contact/
│   └── Homepage/
├── components/         # Shared components (Header, Footer, Loading, AuthProvider)
├── request/            # API layer
│   ├── commons/        # useRequestApi, useQueryWorkflowCallback
│   ├── keys/           # React Query key constants
│   └── route-http/     # API route constants
├── services/           # API service functions
├── types/              # TypeScript types (organized by module)
├── context/            # React contexts (AuthContext)
├── clients/axios/      # Axios configuration
├── StyledComponents/   # Custom styled components
├── enum/               # Enums (RouterEnum, MethodHttpEnum, QueryKeysEnum)
└── utils/              # Utility functions
```

#### Key Frontend Patterns

**1. Separation of UI and Logic** (hooks pattern):
```typescript
// BookAddForm.tsx - Pure presentation
function BookAddForm() {
  const { submit, handleSubmit, errors, control } = AddBookHook();
  return <form onSubmit={handleSubmit(submit)}>...</form>;
}

// BookAdd.hook.ts - All logic
function BookAddHook() {
  const { user } = useContext(AuthContext);
  const { handleSubmit, control, formState: { errors } } = useForm({
    resolver: yupResolver(bookSchema),
  });

  const { mutateAsync: addBook } = useMutation({
    mutationFn: (data) => createBook(data, user?.id),
    onSuccess: () => {
      queryClient.invalidateQueries([BookQueriesKeysEnum.GET_BOOKS]);
      onSuccessCommon('Book created', RouterEnum.HOME);
    },
  });

  return { submit, handleSubmit, errors, control };
}
```

**2. React Query** for server state:
- All API calls use `useMutation` or `useQuery`
- Automatic caching, refetching, invalidation
- Query keys organized by module in `request/keys/`

**3. Form Handling**:
- `react-hook-form` for form state management
- `yup` schemas for validation
- `@hookform/resolvers` for integration
- MUI form components

**4. Authentication Context**:
```typescript
const { user, signin, signinWithGoogle, signout } = useContext(AuthContext);
```

**5. Material-UI**: `@mui/material`, `@mui/joy`, `@mui/x-date-pickers`, `styled-components`

**6. Routing**: `react-router-dom` v6 with `PrivateRoute` wrapper for protected routes

## Module Responsibilities

### User Module
- Registration (email validation, bcrypt password hashing)
- Email/password authentication
- Google OAuth authentication
- JWT token generation
- Current user retrieval
- User entity includes: id, email, password, name, phone, sexe (HOMME/FEMME/AUTRE)

### Book Module
- CRUD operations for books
- AWS S3 cover image upload (PNG/JPEG, max 3MB)
- Paginated book listing
- Search by title (ILIKE query)
- Get user's books with "hasFutureReservations" flag
- Book entity: id, title, description, author, releaseAt, coverUrl, userId

### Booking Module
- Create bookings (with email notification)
- Get booking dates by book ID (for calendar unavailable dates)
- Get user's booking history
- Date range validation
- Booking entity: id, bookId, userId, startAt, endAt

### Contact Module
- Contact form submission
- Email notification to admin
- Contact entity: id, name, email, message

## Git Commit Convention

**Commitlint** enforces this format (validated by Husky pre-commit hook):

```
<type>: <emoji> <ticket> <subject>

Example: feat: :sparkles: ON-236 create docker fixtures to seed the database
```

**Types**: `feat`, `fix`, `chore`, `docs`, `style`, `refactor`, `test`

**Emojis**:
- `:sparkles:` - New features
- `:bug:` - Bug fixes
- `:hammer:` - Refactoring/chores

**Ticket**: `ON-XXX` format (Jira-style)

See `commitlint.config.ts` for full configuration.

## Environment Variables

### Backend (`.env` in `apps/nest/`)
```bash
# Database
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=book_user
DB_PASSWORD=Bonjour_12@
DB_NAME=book_db

# Auth
JWT_SECRET=your-secret-key

# AWS S3
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=...
AWS_BUCKET_NAME=...

# Email
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USER=...
MAIL_PASSWORD=...

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Features
LOAD_FIXTURES=true
NODE_ENV=development
```

See `apps/nest/.env.dist` for template.

### Docker (`.env.docker` at root)
Similar to above but with `DB_HOST=mysql-db` for Docker network.

## Testing

### Backend Testing Strategy

**Location**: `apps/nest/src/test/unitaire/use.case/`

**Pattern**: Test use cases in isolation with mocked dependencies
```typescript
describe('AddUserUseCase', () => {
  let useCase: AddUserUseCase;
  let mockRepository: Mock<UsersRepository>;
  let mockEmailClient: Mock<NodemailerClient>;

  beforeEach(() => {
    mockRepository = mock<UsersRepository>();
    mockEmailClient = mock<NodemailerClient>();
    mockRepository.signUp.mockResolvedValue(userResponse);

    useCase = new AddUserUseCase(mockRepository, mockEmailClient);
  });

  it('should create user successfully', async () => {
    const result = await useCase.execute(userRequest);
    expect(result).toEqual(userResponse);
    expect(mockRepository.signUp).toHaveBeenCalledWith(userRequest);
  });
});
```

**Tools**: Jest, `ts-jest-mocker`, `@golevelup/ts-jest`

**Integration Tests**: Use `@testcontainers/mysql` for real database testing

## Adding New Features

### Backend Checklist

When adding a new feature (e.g., "Review" module):

1. **Create domain structure**:
```
domaine/review/
├── entities/Review.entity.ts
├── repositories/review.repository.ts
└── usecases/addReview/
    ├── addReview.usecase.ts
    ├── addReview.request.ts
    └── addReview.response.ts
```

2. **Create infrastructure**:
```
infras/models/review.model.ts
infras/services/review.repository.typeorm.ts
infras/controllers/review/addReview/
├── addReview.controller.ts
└── addReview.dto.ts
```

3. **Wire in `usecase-proxy.module.ts`** (CRITICAL):
```typescript
static ADD_REVIEW_USECASE_PROXY = 'addReviewUsecaseProxy';

providers: [
  {
    inject: [ReviewRepositoryTypeorm],
    provide: UsecaseProxyModule.ADD_REVIEW_USECASE_PROXY,
    useFactory: (repo) => new UseCaseProxy(new AddReviewUseCase(repo)),
  },
]
```

4. **Add controller to `controller.module.ts`**

5. **Update TypeORM module** to include new entity

6. **Write unit test**: `test/unitaire/use.case/review/add.review.spec.ts`

### Frontend Checklist

1. **Create feature folder**:
```
pages/review/
├── AddReview/
│   ├── AddReviewForm.tsx
│   └── AddReview.hook.ts
└── ReviewList/
    └── ReviewList.tsx
```

2. **Add types**: `types/review/review.types.ts`

3. **Add service**: `services/review.service.ts`

4. **Add React Query keys**: `request/keys/review.keys.ts`

5. **Update router**: `router.tsx` and `enum/enum.ts`

## Common Pitfalls to Avoid

1. ❌ **Don't put business logic in controllers** → Use cases only!
2. ❌ **Don't use TypeORM entities in domain layer** → Keep domain entities pure
3. ❌ **Don't forget to register in `usecase-proxy.module.ts`** → DI won't work
4. ❌ **Don't skip `handleDatabaseError()`** → Consistent error handling
5. ❌ **Don't forget React Query cache invalidation** → Stale data
6. ❌ **Don't hardcode routes/URLs** → Use constants from enums
7. ❌ **Don't skip form validation** → Both client and server side

## Key Architectural Principles

1. **Domain Independence**: Domain layer knows nothing about NestJS, TypeORM, HTTP
2. **Repository Pattern**: Domain defines interfaces, infrastructure implements
3. **Dependency Inversion**: Use cases depend on abstractions (repository interfaces), not concrete implementations
4. **Single Responsibility**: One use case = one business operation, one controller file = one endpoint
5. **Separation of Concerns**: UI components don't contain logic (use custom hooks)
6. **Type Safety**: Full TypeScript coverage with strict mode
7. **Error Consistency**: All errors mapped through centralized handlers

## Navigation Tips

**Looking for...**
- Business logic? → `apps/nest/src/domaine/{module}/usecases/`
- API endpoints? → `apps/nest/src/infras/controllers/{module}/`
- Database queries? → `apps/nest/src/infras/services/`
- Dependency injection setup? → `apps/nest/src/infras/usecase-proxy/usecase-proxy.module.ts`
- Database schema? → `apps/nest/src/infras/models/`
- UI components? → `apps/client-react/src/pages/{module}/`
- API calls? → `apps/client-react/src/services/`
- Type definitions? → `apps/client-react/src/types/{module}/`
- Authentication logic? → Backend: `domaine/user/usecases/auth/`, Frontend: `context/AuthContext.tsx`
