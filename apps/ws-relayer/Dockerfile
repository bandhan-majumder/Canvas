FROM oven/bun:1.3.1-alpine AS base
 
FROM base AS builder
WORKDIR /app
RUN bun install --global turbo@^2
COPY . .
 
RUN turbo prune ws-relayer --docker
 
FROM base AS installer
WORKDIR /app
 
COPY --from=builder /app/out/json/ .
RUN bun install --linker hoisted
 
COPY --from=builder /app/out/full/ .

RUN bun run turbo build
 
FROM base AS runner
WORKDIR /app

COPY --from=installer /app/apps/ws-relayer/dist .
COPY --from=installer /app/node_modules ./node_modules

EXPOSE 3002

CMD ["bun", "index.mjs"]
