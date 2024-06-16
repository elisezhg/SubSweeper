FROM --platform=linux/amd64 node:20-alpine

WORKDIR /app

COPY . .

RUN npm ci

EXPOSE 3000

CMD ["node", "server.js"]
