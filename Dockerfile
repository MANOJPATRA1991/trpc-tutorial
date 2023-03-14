FROM node:latest

WORKDIR /src

COPY package*.json /

EXPOSE 3000

RUN npm install

COPY . /

CMD ["npm", "run", "dx:next"]