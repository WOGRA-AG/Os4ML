FROM nginx:stable-alpine as production

COPY nginx/ /etc/nginx/conf.d/
COPY dist/os4ml/ /usr/share/nginx/html/
