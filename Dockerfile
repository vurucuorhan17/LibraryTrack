FROM node:latest

WORKDIR /LibraryTrack

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 3000