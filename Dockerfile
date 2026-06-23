FROM gcr.io/distroless/nodejs24-debian12 AS runner
FROM node:24-trixie AS base

FROM base AS dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
CMD ["npm", "run", "dev"]

FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

FROM base AS build
WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

FROM runner AS prod
WORKDIR /app
COPY --from=build /app/dist/ ./
COPY --from=deps /app/node_modules ./node_modules
CMD ["--max-old-space-size=512", "server.js"]
