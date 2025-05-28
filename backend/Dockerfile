FROM node:20

WORKDIR /backend

COPY backend/package*.json ./
RUN rm -rf node_modules
RUN npm install

COPY shared ../shared
COPY backend .


RUN npm uninstall bcrypt
RUN npm i bcrypt

RUN npm run build

CMD ["npm", "run", "start:prod"]