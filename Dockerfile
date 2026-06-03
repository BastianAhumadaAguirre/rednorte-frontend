FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY package.json ./
COPY pnpm-lock.yaml* package-lock.json* ./

RUN if [ -f pnpm-lock.yaml ]; then pnpm install --shamefully-hoist; else npm ci; fi

COPY . .

EXPOSE 5173

CMD ["pnpm", "run", "dev"]
