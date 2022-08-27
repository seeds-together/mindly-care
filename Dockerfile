FROM node:16-alpine

RUN mkdir -p /home/mindly-care-app

COPY . /home/mindly-care-app

WORKDIR /home/mindly-care-app

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node", "index.js"]