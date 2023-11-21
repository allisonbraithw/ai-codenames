FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm urn build

EXPOSE 3000

CMD ["npm", "start"]