FROM node:12-alpine

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY src src
COPY public public

COPY server.ts swagger.ts tsconfig.json ./

RUN npm run build-ts

CMD ["npm", "run", "start"]
