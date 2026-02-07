# ================================
# STAGE 1: Dependencies
# ================================
FROM node:20-alpine AS deps

WORKDIR /app
ENV PRISMA_CLIENT_ENGINE_TYPE=library
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# Copy package files
COPY package.json package-lock.json* ./
COPY prisma ./prisma/

# Install dependencies
RUN npm install --production=false

# Generate Prisma client
RUN npx prisma generate

# ================================
# STAGE 2: Builder
# ================================
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PRISMA_CLIENT_ENGINE_TYPE=library
ENV DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres"

# Build the application
RUN npm run build

# ================================
# STAGE 3: Runner (Production)
# ================================
FROM node:20-alpine AS runner
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PRISMA_CLIENT_ENGINE_TYPE=library

# Create non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy built assets from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Create uploads directories for both project images and task files
RUN mkdir -p uploads/images public/uploads/tasks && \
    chown -R nextjs:nodejs uploads public/uploads

# Install Chromium and dependencies for Puppeteer
RUN apk add --no-cache \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Tell Puppeteer to skip downloading Chrome. We'll be using the installed package.
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Set correct permissions for prerendered cache
RUN mkdir -p .next
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copy Prisma client and all dependencies from deps
# This ensures bcryptjs and other runtime dependencies are available
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma

# Install Prisma CLI globally for runtime migrations/db push
RUN npm install -g prisma@5.21.1

# Copy start script
COPY scripts/start.sh ./start.sh
RUN chmod +x ./start.sh

# Fix permissions for nextjs user
RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["./start.sh"]
