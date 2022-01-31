FROM node:17 AS builder
WORKDIR /usr/src/app
COPY package*.json ./
# RUN npm install
RUN npm ci
COPY . .
RUN npm run build

FROM node:17-alpine
# RUN apk add --no-cache bash
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /usr/src/app/dist ./dist
CMD [ "node", "dist/server.js" ]