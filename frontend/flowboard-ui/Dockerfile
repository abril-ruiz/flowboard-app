# Dockerfile multi-stage para Vite y Nginx
# Etapa 1: Construcción de la app con Node.js
FROM node:20 AS builder
WORKDIR /app

# Copiar package files primero para cache
COPY package*.json ./
RUN npm install

# Copiar código fuente y construir
COPY . .
RUN npm run build

# Etapa 2: Servidor Nginx
FROM nginx:alpine

# Copiar build de Vite a Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copiar configuración personalizada de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Exponer puerto
EXPOSE 80

# Healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Nginx corre en foreground por defecto en Alpine
CMD ["nginx", "-g", "daemon off;"]