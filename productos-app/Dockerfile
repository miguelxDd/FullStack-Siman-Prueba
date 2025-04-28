# Imagen de Node.js para construir el proyecto
FROM node:18 as build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Servir la aplicación con Nginx
FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html
#Confiración de Nginx del puerto 80
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
