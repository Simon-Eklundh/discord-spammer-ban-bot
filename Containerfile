# This image is published to GHCR
# (ghcr.io/simon-eklundh/discord-spammer-ban-bot) on every push to master and is
# meant to be pullable anonymously, so nothing secret may enter it: no ENV
# secrets, no copied config, no .env. DISCORD_TOKEN is injected at runtime by the
# deployment and is never baked in. Only package.json, package-lock.json,
# tsconfig.json and src are copied -- there is no `COPY . .` -- and
# .containerignore keeps .env, .env.*, .git and dist out of the build context.

FROM node:26-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY tsconfig.json ./
COPY src ./src
RUN npm run build

FROM node:26-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

COPY --from=builder /app/dist ./dist

CMD ["node", "dist/index.js"]
