FROM node:alpine3.13

WORKDIR /app

ADD package.json .
RUN npm config set registry http://registry.npmjs.org
RUN npm i -g @nestjs/cli
RUN npm install

ADD . .

EXPOSE 3000

CMD ["npm", "run", "start"]