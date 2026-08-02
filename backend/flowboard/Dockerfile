# Dockerfile multi-stage para Spring Boot y Maven
# Etapa 1: Construcción de la app con Maven
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

LABEL description = "Imagen del backend"
# Copiar solo pom.xml primero para aprovechar cache de Maven
COPY pom.xml .
COPY src ./src

# Compilar y empaquetar la app 
RUN mvn clean package -DskipTests -q

# Etapa 2: Servidor con JRE
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

# Copiar el JAR compilado 
COPY --from=builder /app/target/*.jar app.jar

# Exponer puerto
EXPOSE 8080

# Variables de entorno para Spring Boot 
ENV SPRING_PROFILES_ACTIVE=prod \
    SERVER_PORT=8080

# Healthcheck para que docker-compose espere a que esté listo
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Ejecutar la app
ENTRYPOINT ["java", "-jar", "app.jar"]