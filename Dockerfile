FROM node:11

RUN apt-get update  && apt-get install -y nginx

RUN npm install yarn -g

WORKDIR /app

COPY package*.json ./
COPY . /app

RUN npm install && npm run build:prod

RUN cp -r dist/* /var/www/html/ && cp nginx.conf /etc/nginx/conf.d/

EXPOSE 8081

CMD ["nginx","-g","daemon off;"]