FROM node:lts-alpine

WORKDIR /usr/src/app

COPY package.json .
COPY package-lock.json .
RUN npm install

COPY . .
RUN npm run build

EXPOSE 4050

CMD ["npm", "start"]
