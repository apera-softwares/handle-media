# ==========================================
# Stage 1: Build the application
# ==========================================
FROM --platform=linux/amd64 node:20-alpine AS builder

WORKDIR /app

# Copy dependency definitions first (better layer caching)
COPY package*.json ./

# Install ALL dependencies (devDeps needed to compile TypeScript)
RUN npm ci

# Copy source code and build
COPY . .
RUN npm run build

# Remove devDependencies for a lean production node_modules
RUN npm prune --omit=dev

# ==========================================
# Stage 2: Production Image
# ==========================================
FROM --platform=linux/amd64 node:20-alpine AS production

WORKDIR /app

# Create uploads directory (will be overridden by volume mount)
RUN mkdir -p /app/uploads

# Copy only what's needed to run
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY package*.json ./

ENV PORT=4044
ENV FILEPATH=/app/uploads/
ENV ACCESS_TOKEN=""

EXPOSE 4044

CMD ["node", "dist/main"]