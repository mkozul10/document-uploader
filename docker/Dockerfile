FROM node:20.11 AS base

FROM base AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build


FROM base AS runner

ENV NODE_ENV production

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci
RUN rm package.json package-lock.json

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

EXPOSE 3000

CMD ["node", "dist/main.js"]
