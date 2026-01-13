FROM oven/bun:1.3.1-alpine AS base
 
FROM base AS builder
WORKDIR /app
RUN bun install --global turbo@^2
COPY . .
 
RUN turbo prune ws-backend --docker
 
FROM base AS installer
WORKDIR /app
 
COPY --from=builder /app/out/json/ .
RUN bun install --linker hoisted
 
COPY --from=builder /app/out/full/ .

RUN bun run turbo build
 
FROM base AS runner
WORKDIR /app

COPY --from=installer /app/apps/ws-backend/dist .
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3001

CMD ["bun", "index.mjs"]
