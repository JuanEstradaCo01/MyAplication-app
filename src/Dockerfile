#RECORDATORIO: eliminar node_modules antes de construir la imagen

FROM node:18.14.2

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 8080

CMD ["npm","start"]