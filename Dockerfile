FROM node:16.14.2-alpine3.14
WORKDIR /app
COPY . .
RUN npm install --production
RUN npm run build

FROM nginx:1.21.1-alpine
COPY nginx.conf /etc/nginx/nginx.conf
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
