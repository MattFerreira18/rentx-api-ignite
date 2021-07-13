# container image
FROM node

# diretório do docker
WORKDIR /usr/app

COPY package.json ./

RUN npm install

#  copy all to root folder
COPY . .

# port
EXPOSE 5500

# permite rodar os comandos
CMD ["npm", "run", "dev:server"]

# command to inicialize docker build
# docker build -t rentalx .

# docker run -p 5500:5500 rentalx

# open container terminal
# docker exect -it CONTAINER_NAME /bin/bash
