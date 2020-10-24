FROM node:lts-alpine AS builder

# Python and Make
#ENV PYTHONUNBUFFERED=1
#RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
#RUN python3 -m ensurepip
#RUN pip3 install --no-cache --upgrade pip setuptools
#RUN apk add g++ make python
#RUN node --version
#RUN apk add --update pkgconfig

WORKDIR /app
COPY . .
RUN export WEB=true && npm install && npm run build

FROM nginx:1.17-alpine AS runner
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
WORKDIR /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
