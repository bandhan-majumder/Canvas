## Draw shapes, share, collaborate

![demo image](/assets/image.png)

### Steps to run locally

```
git clone https://github.com/bandhan-majumder/Canvas
cd Canvas
pnpm install
```

Copy the .env.sample files and setup the db url and password

```
cp apps/web/.env.sample apps/web/.env
cp apps/ws-backend/.env.sample apps/ws-backend/.env
cp apps/ws-relayer/.env.sample apps/ws-relayer/.env
cp packages/db/.env.sample packages/db/.env
```

go to the root directory and run the below command. But make sure the relayer starts first, else ws-backend may fail
```
pnpm run dev
```

## This turbo repo contains 3 main projects

1. Web
2. Websocket backend 1 (relayer)
3. Websocket backend 2

## Features

1. Draw line, circle, square
2. Collaborate in real time
3. Zoom feature
4. Get data synced in real time

## Technologies used

1. Turbo repo, nextjs, next-auth
2. Websocket
3. Drizzle, Postgres

## Deployed on

1. Render (websocket)
2. Vercel (frontend)
