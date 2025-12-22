# 🚀 SOSIDE Platform

**SOSIDE** (Software Side) is a comprehensive ecosystem designed for developers, students, and recruiters. This monorepo contains a microservices-based backend and a modern Next.js frontend with an integrated Admin Dashboard.

## 🏗️ Architecture

The platform is built on a **Microservices Architecture** using NestJS and communicated via Redis/TCP.

### Microservices
- **Auth**: User management, JWT, 2FA, and RBAC.
- **Blog**: Technical articles and community posts.
- **Project**: Portfolio management and showcasing.
- **Learning (LMS)**: Online courses, modules, and certificates.
- **Community**: Regional chapters, events, and real-time chat.
- **Recruitment**: Job board and application tracking.
- **AI**: Automation workflows and prompt engineering.

### Frontend
- **Framework**: Next.js 15+ (App Router).
- **UI Library**: Shadcn UI + Tailwind CSS v4.
- **State Management**: Zustand.

## 🛠️ Tech Stack
- **Backend**: NestJS, TypeORM, PostgreSQL, Redis.
- **Frontend**: Next.js, React, Axios, Framer Motion.
- **DevOps**: Docker, Nginx, GitHub Actions.

## 🚀 Getting Started

### Prerequisites
- Docker & Docker Compose
- Node.js 20+

### Quick Setup (Docker)
The easiest way to run the entire stack is using Docker Compose:

```bash
docker-compose up --build
```
The application will be available at [http://localhost](http://localhost).
- **Frontend**: `localhost`
- **API Gateway**: `localhost/api`

### Local Development
1. **Install Dependencies**:
   ```bash
   npm install
   npm run install:all
   ```
2. **Launch everything**:
   ```bash
   npm run dev
   ```

## 🔒 Administration
Access the Admin Dashboard at `/admin`.
- **Note**: Ensure your user has the `admin` role in the database.

## 🚢 CI/CD & DevOps
- **Nginx**: Acts as a reverse proxy, handling routing between frontend and backend.
- **GitHub Actions**: Automated builds and Docker image validation on every push.
- **Health Checks**: Containers are monitored for stability.

## 📄 License
Created by SOSIDE Team. Proprietary.
