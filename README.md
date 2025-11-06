## Draw shapes, share, collaborate

![demo image](/assets/image.png)

### Steps to run locally

```
git clone https://github.com/bandhan-majumder/Canvas
cd Canvas
npm install
```

Copy the .env.sample files and setup the db url and password

```
cp apps/web/.env.sample apps/web/.env
cp packages/db/.env.sample packages/db/.env
```

go to the root directory and run

```
cd ../..
npm run dev
```

## This turbo repo contains 2 main projects

1. Web
2. Websocket backend

- Websocket backend is deployed on render.

## Features

1. Draw line, circle, square
2. Collaborate in real time
3. Zoom feature
4. Get data synced in real time

## Technologies used

1. Turbo repo, nextjs, next-auth
2. Websocket
3. Prisma, Postgres

## Deployed on

1. Render (websocket)
2. Vercel (frontend)
