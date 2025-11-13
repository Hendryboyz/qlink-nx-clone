# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Nx monorepo containing a full-stack application with:
- **be**: NestJS backend API server
- **client**: Next.js frontend for end users
- **bo**: React + Vite frontend for back office administration
- **common**: Shared utilities and business logic (`@org/common`)
- **types**: Shared TypeScript types (`@org/types`)

## Development Setup

### Initial Setup
1. Copy environment configuration:
   ```bash
   mv .env.dev-local .env
   ```

2. Start PostgreSQL database:
   ```bash
   docker-compose -f ./docker-compose.yml up -d
   ```

3. Run database migrations:
   ```bash
   npm run clean
   npm run migrate
   ```

### Running Applications

Start individual services:
```bash
nx serve be      # Backend API (http://localhost:3000/backend/api)
nx serve client  # Client frontend (http://localhost:4200)
nx serve bo      # Back office (http://localhost:5173)
```

Start all services simultaneously:
```bash
nx run-many --targets serve
```

### Building
```bash
nx build <app-name>              # Build specific app
nx build be --configuration=production
```

### Testing
```bash
nx test <app-name>               # Run tests for specific app
nx test be                       # Run backend tests
nx test client                   # Run client tests
```

### Linting
```bash
nx lint <app-name>               # Lint specific app
```

## Database Management

This project uses Flyway for database migrations with PostgreSQL.

### Migration Commands
```bash
npm run migrate   # Run all pending migrations
npm run info      # Show migration status
npm run validate  # Validate applied migrations
npm run clean     # Drop all database objects (use with caution)
npm run baseline  # Set baseline for existing database
npm run repair    # Repair schema history table
```

### Migration Files
- Location: `db_migration/migrations/`
- Naming: `V{version}__{description}.sql` (e.g., `V1__Create_users_table.sql`)
- Seed files: `db_migration/seeds/` with naming `R__{description}.sql`

### Database Connection
- Default PostgreSQL runs on port 5433 (mapped from container port 5432)
- Database: `qride`
- User: `local`
- Configure via environment variables: `DB_HOST`, `DB_NAME`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`

## Architecture

### Backend (apps/be)
- Framework: NestJS with TypeScript
- Structure: Modular architecture with the following modules:
  - `auth`: Authentication and authorization
  - `user`: User management
  - `product`: Product management
  - `posts`: Post/content management
  - `crm`: CRM integration (Salesforce)
  - `bo`: Back office specific modules (auth, posts, user, verification, vehicles, statistic)
  - `upload`: File upload and storage (AWS S3)
- Database: TypeORM with PostgreSQL
- API Prefix: `backend/api` (configurable via `API_PREFIX`)
- Global exception filter and CORS enabled
- File uploads served from `/uploads/` path

### Client Frontend (apps/client)
- Framework: Next.js 14 with TypeScript
- Authentication: NextAuth.js
- Styling: Tailwind CSS
- Features include vehicle management, user authentication, reCAPTCHA integration

### Back Office (apps/bo)
- Framework: React 18 + Vite
- UI Components: Ant Design (@ant-design/pro-components)
- Rich text editor: React Quill with custom image resize and table support
- Charts: ECharts
- State management: React hooks and context

### Shared Libraries

#### @org/common (common/)
Shared business logic and utilities:
- `bizCode.ts`: Business error codes
- `constant.ts`: Application constants
- `error.ts`: Error handling utilities
- `regexp.ts`: Regular expression patterns
- `state.ts`: State management utilities
- `utils.ts`: Common utility functions

#### @org/types (types/)
Shared TypeScript type definitions:
- `auth.ts`: Authentication types
- `user.ts`: User related types
- `product.ts`: Product types
- `posts.ts`: Post/content types
- `moto.ts`: Vehicle/motorcycle types
- `bo/`: Back office specific types

Import path aliases:
- `@org/common` → `common/src/index.ts`
- `@org/types` → `types/src/index.ts`
- `$` → App-specific root directory (configured per app)

## Technology Stack

### Backend
- NestJS 10.x
- TypeORM
- PostgreSQL (via pg driver)
- JWT authentication (passport-jwt)
- AWS SDK (S3, CloudFront)
- Nodemailer for email
- bcrypt for password hashing
- Cheerio for HTML parsing
- Schedule tasks with @nestjs/schedule

### Frontend (Client)
- Next.js 14
- React 18
- NextAuth.js
- Tailwind CSS
- React Hook Form + Yup validation
- Axios for API calls
- dayjs for date handling

### Frontend (Back Office)
- React 18
- Vite
- Ant Design 5
- React Quill (rich text editor)
- ECharts (charts and visualization)
- React Router 6
- Formik + Yup validation

### Development Tools
- Nx 17.x for monorepo management
- TypeScript 5.2
- Jest for testing
- ESLint + Prettier
- Docker for local PostgreSQL

## Environment Variables

Key environment variables (see `.env.template` for complete list):

### Backend
- `JWT_SECRET`: JWT token secret
- `DB_HOST`, `DB_NAME`, `DB_PORT`, `DB_USERNAME`, `DB_PASSWORD`: Database connection
- `AWS_S3_REGION`, `AWS_S3_BUCKET`, `AWS_CLOUDFRONT_HOSTNAME`: AWS configuration
- `SMTP_*`: Email service configuration
- `IS_OTP_ENABLED`: OTP feature flag
- `RECAPTCHA_SECRET_KEY`: reCAPTCHA server key
- `SALESFORCE_*`: Salesforce CRM integration
- `ALLOWED_ORIGINS`: CORS allowed origins

### Client Frontend
- `NEXT_PUBLIC_API_URL`: Backend API URL
- `NEXTAUTH_URL`, `NEXTAUTH_SECRET`: NextAuth configuration
- `NEXT_PUBLIC_RECAPTHCA_SITEKEY`: reCAPTCHA site key
- `NEXT_PUBLIC_IS_OTP_ENABLED`: OTP feature flag

### Back Office
- `VITE_BO_PUBLIC_API_URL`: Backend API URL for BO
- `VITE_BO_ROUTER_BASENAME`: Router base path
- `VITE_BO_HIGHLIGHT_POSTS_LIMIT`: Featured posts limit

## Version Management

This project uses release-it for version management:
```bash
npm run release  # Create a new release
```

Configuration in `.release-it.json`

## Node Version

Required Node.js version: 20.18.x (specified in package.json engines)
