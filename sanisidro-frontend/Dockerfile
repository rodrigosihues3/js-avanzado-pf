# 1. Build
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm ci 

COPY . .

# Construye la app para producción
RUN npm run build

# 2. Servidor Nginx
FROM nginx:alpine

# Copia el build generado en el punto 1
COPY --from=build /app/build /usr/share/nginx/html

# Copia configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]