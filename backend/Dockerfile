FROM node:22.17.0
WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

ENV TZ="America/Mexico_City"

CMD ["npm", "start"]
