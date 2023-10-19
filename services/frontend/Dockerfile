FROM nginxinc/nginx-unprivileged:1.25-alpine as production

COPY --chown=101:1 nginx/ /etc/nginx/conf.d/
COPY --chown=101:1 dist/os4ml/ /usr/share/nginx/html/
