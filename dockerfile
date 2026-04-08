# Build stage: need devDependencies

FROM node:alpine AS builder
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage: production deps only and copy build output
FROM node:alpine
RUN mkdir /app
WORKDIR /app


COPY package.json package-lock.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

EXPOSE 3000

ENV HOSTNAME="0.0.0.0"

ENTRYPOINT ["npm", "run", "start"]

