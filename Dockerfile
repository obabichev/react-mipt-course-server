FROM node:12-alpine as dev

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

COPY src src
COPY public public

CMD ["npm", "run", "dev"]

COPY server.ts swagger.ts tsconfig.json ./

FROM dev

RUN npm run build-ts

CMD ["npm", "run", "start"]
