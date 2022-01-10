# Stage 1 - build application
FROM node:14.17.5-alpine3.14 as node
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Stage 2 - serve static files
FROM nginx:alpine
ENV NODE_ENV=production
COPY --from=node /usr/src/app/build /usr/share/nginx/html
COPY ./outdated-browser.html /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/conf.d/default.conf
RUN env | grep "^UI*" >> /usr/share/nginx/html/env.js