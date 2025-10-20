FROM node:22.20-alpine
WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 8000

CMD ["npm", "start"]
