# =============================================================================
# Dockerfile — Next.js standalone runner
# The server image does not include the full app node_modules.
# Prisma migrate/seed use a small tool tree under /opt/tools.
# =============================================================================

ARG NODE_IMAGE=public.ecr.aws/docker/library/node:22-alpine

# ---- Dependencies ----
FROM ${NODE_IMAGE} AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
# postinstall runs prisma generate and needs the schema; generate happens in the builder stage.
RUN npm ci --ignore-scripts

# ---- Build ----
FROM ${NODE_IMAGE} AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://postgres:postgres@db:5432/starter_dev"
RUN npx prisma generate && \
    npm run build && \
    node docker/copy-migrate-tools.mjs

# ---- Production ----
FROM ${NODE_IMAGE} AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache wget && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/prisma.config.ts ./prisma.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/generated ./generated
COPY --from=builder --chown=nextjs:nodejs /app/lib/load-env-file.ts ./lib/load-env-file.ts
COPY --from=builder --chown=nextjs:nodejs /app/lib/rbac ./lib/rbac
COPY --from=builder --chown=nextjs:nodejs /opt/tools /opt/tools
COPY docker/entrypoint.sh ./entrypoint.sh

RUN mkdir -p /app/.next/cache && \
    chown -R nextjs:nodejs /app/.next /opt/tools && \
    chmod +x /app/entrypoint.sh

USER nextjs
EXPOSE 3000

CMD ["./entrypoint.sh"]
