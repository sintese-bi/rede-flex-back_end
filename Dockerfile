FROM node:16-alpine

WORKDIR /usr/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

RUN npm install -g ts-node-dev

RUN npx prisma generate

COPY . .

EXPOSE 8080

CMD ["npm", "run", "dev"]
