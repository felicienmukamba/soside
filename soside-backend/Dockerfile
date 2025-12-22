# Build stage
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm install

# Copy source
COPY . .

# Argument to specify which service to build
ARG SERVICE_NAME
RUN pnpm build ${SERVICE_NAME}

# Runtime stage
FROM node:22-alpine AS runner

WORKDIR /app

# Copy only built artifacts
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist/apps/${SERVICE_NAME} ./dist
COPY --from=builder /app/nest-cli.json ./

# Environment variable for the service
ENV SERVICE=${SERVICE_NAME}

CMD node dist/main.js
