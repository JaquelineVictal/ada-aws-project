FROM node:18 as builder

WORKDIR /app
COPY . .

RUN npm install -g @angular/cli

RUN npm install
RUN ng build

FROM nginx:alpine

RUN rm -rf /usr/share/nginx/html/*
COPY --from=builder /app/dist/ada-aws-project /usr/share/nginx/html
COPY /nginx.conf /etc/nginx/conf.d/default.conf


EXPOSE 80