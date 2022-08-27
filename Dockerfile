FROM node:16-alpine

RUN mkdir -p /home/mindly-care-app

COPY . /home/mindly-care-app

WORKDIR /home/mindly-care-app

RUN npm ci  --only=production

CMD ["node", "index.js"]