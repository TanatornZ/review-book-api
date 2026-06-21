# review-book-api

Practice API repository for a book-review platform built with **NestJS**, **Prisma**, and **PostgreSQL**.

## Features

- REST API for authentication, books, and reviews
- GraphQL read queries for books
- JWT authentication
- Security middleware with Helmet and input validation

## Tech Stack

- NestJS
- Prisma ORM
- PostgreSQL

## Quick Start

1. Install dependencies
   ```bash
   npm install
   ```
2. Configure environment variables
   ```bash
   cp .env.example .env
   ```
3. Generate Prisma client and run migrations
   ```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```
4. Start development server
   ```bash
   npm run start:dev
   ```

## Environment Variables

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret (required)
- `PORT` - API port (default `3000`)
- `CORS_ORIGIN` - allowed origin list, comma-separated (for example `http://localhost:3000`)
