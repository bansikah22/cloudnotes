FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json tsconfig.json ./

# Install ALL dependencies (including devDependencies)
RUN npm ci

COPY . .

RUN npm run build

FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

EXPOSE 5000

CMD ["node", "dist/index.js"]