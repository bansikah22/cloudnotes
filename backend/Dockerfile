FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

# Install dependencies
RUN npm ci

COPY . .

RUN npm run build

# Prune dev dependencies
RUN npm ci --omit=dev && npm cache clean --force

FROM alpine:latest

WORKDIR /app

ENV NODE_ENV=production

# Install nodejs
RUN apk add --no-cache nodejs

COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist

# Create a non-root user
RUN addgroup -S node && adduser -S node -G node
USER node

EXPOSE 5000

CMD ["node", "dist/index.js"]