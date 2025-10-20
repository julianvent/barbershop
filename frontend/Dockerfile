FROM node:22.20-alpine

COPY . /app
WORKDIR /app

COPY package.json ./package.json
COPY package-lock.json ./package-lock.json

EXPOSE 3000

RUN npm ci

CMD [ "npm" "run" "start" ]