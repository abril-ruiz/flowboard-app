# Flowboard Backend

## Descripción

API RESTful desarrollada con Spring Boot 4 y Java 21 que gestiona la lógica de negocio, seguridad y persistencia del sistema FlowBoard. Implementa autenticación stateless con JWT, un modelo de dominio centrado en procesos con máquina de estados estricta, y roles de usuario con autorización declarativa.

La capa de seguridad incluye validación de contraseñas conforme a estándares NIST, encriptación BCrypt y auditoría inmutable de cambios críticos. Todos los endpoints están documentados automáticamente con OpenAPI 3.0 para facilitar la integración con el frontend.

## Tecnologías

- Spring Boot 4.0.5 (Web, Security, Data JPA, Validation, Actuator)
- Java 21 (LTS)
- PostgreSQL 16
- jjwt 0.12.5 + BCrypt
- springdoc-openapi 2.7.0
- Maven 3.9+

## Configuración: Variables de Entorno / application.properties

El backend utiliza variables de entorno para gestionar credenciales sensibles. Edita el archivo application.properties con tus propias credenciales:

```bash
# Database
spring.datasource.url=jdbc:postgresql://${DB_HOST:postgres}:${DB_PORT:5432}/${DB_NAME:flowboard_db}
spring.datasource.username=tu_usuario
spring.datasource.password=tu_contraseña

# JPA/Hibernate
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# JWT
app.jwt.secret=tu_clave_JWT_secreta
app.jwt.expiration-ms=86400000

# Server
server.port=8080
```

## Ejecución

### Opción - Desarroollo Local:

```bash
# 1. Clonar repositorio y configurar variables
git clone https://github.com/abril-ruiz/flowboard-app.git
cd flowboard-app
cp .env.example .env

# 2. Configurar la base de datos PostgreSQL
# - Crea en PostgreSQL una base de datos vacía (ej: flowboard_db)
# - Ajusta las propiedades en src/main/resources/application-local.properties:
   spring.datasource.url=jdbc:postgresql://localhost:5432/flowboard_db
   spring.datasource.username=tu_usuario
   spring.datasource.password=tu_contraseña
   spring.jpa.hibernate.ddl-auto=update

# 3. Iniciar backend
cd backend/flowboard
mvn spring-boot:run

# 4. Acceder
🔙 API: http://localhost:8080/api
📖 Swagger: http://localhost:8080/swagger-ui/index.html
```

### Opción - Docker:

```bash
# Desde la raíz del proyecto:
docker compose up --build backend
```

🔗 Ver [README raíz(`flowboard-app/`)](../../README.md) para levantar todo el stack.

## Estructura del proyecto

```
src/main/java/com/abril/flowboard/
├── config/
│   └── SecurityConfig.java      # Configuración de Spring Security + CORS
│
├── controller/                  # Endpoints REST (@RestController)
│   ├── AdminController.java     # Endpoints exclusivos para ADMIN
│   ├── AuthController.java      # Login, registro: genera y valida tokens JWT
│   ├── CollaborationController.java # Comentarios, tags, filtrado avanzado y estadísticas de colaboración
│   ├── NotificationController.java  # Listado de notificaciones del usuario
│   ├── ProcessController.java   # CRUD de procesos + filtros
│   ├── StatsController.java     # Estadísticas mensuales de procesos para gráficos del dashboard
│   └── UserController.java      # Actualización de perfil y cambio de contraseña con validación NIST
│
├── service/                     # Lógica de negocio (@Service, @Transactional)
│   ├── AdminService.java        # Actualización de roles de usuarios con prevención de auto-bloqueo
│   ├── AuthService.java         # Validación de credenciales, generación de JWT
│   ├── NotificationService.java # Creación, listado y marcado como leído de notificaciones de usuario
│   ├── StatsService.java        # Cálculo de estadísticas mensuales de procesos para visualización
│   ├── UserService.java         # Obtención del usuario actual desde token JWT y validaciones de perfil
│   ├── ProcessService.java       # Reglas de transición de estados, filtros
│   └── CollaborationService.java # Comentarios, notificaciones, tags
│
├── repository/                  # Interfaces JPA (@Repository)
│   ├── UserRepository.java     # Acceso a datos de usuarios
│   ├── ProcessRepository.java  # Acceso a procesos
│   ├── CommentRepository.java  # Acceso a comentarios
│   └── ...
│
├── model/                       # Entidades JPA (@Entity)
│   ├── User.java
│   ├── Process.java
│   ├── Comment.java
│   ├── ProcessAudit.java        # Auditoría inmutable
│   └── ...
│
├── dto/                         # Records para request/response (inmutables)
│   ├── AuthRequest.java
│   ├── ProcessResponse.java
│   ├── CommentRequest.java
│   └── ...
│
├── enums/                       # Tipos seguros
│   ├── Role.java                  # ADMIN, USER
│   ├── ProcessStatus.java         # CREADO, EN_PROGRESO, etc.
│   └── StateTransitionRules.java  # Reglas de transición de estados
│
└── security/                    # Infraestructura de seguridad
    ├── JwtTokenProvider.java    # Generación y validación de JWT
    ├── JwtAuthenticationFilter.java # Filtro que valida token en cada request
    └── UserDetailsServiceImpl.java  # Integración con Spring Security
```

## Funcionalidades

- Autenticación stateless con JWT y validación en cada request
- Roles de usuario (ADMIN / USER) con autorización declarativa (@PreAuthorize)
- Contraseñas hasheadas con BCrypt (12 rounds) y validación NIST SP 800-63B
- Auditoría inmutable de cambios: quién, cuándo y por qué se modificó un proceso
- Filtros avanzados: estado + usuario + etiqueta + fecha
- Etiquetas (tags) para clasificación y organización de procesos
- Documentación automática de endpoints con OpenAPI 3.0 (Swagger)
- CORS configurado para permitir peticiones desde el frontend en desarrollo
- Healthcheck con Spring Boot Actuator para orquestación con Docker

## Preview Swagger UI

<p align="center">
  <img src="../../screenshots/swagger_ui (2).png" alt="Detalle de proceso" width="85%">
</p>

Documentación interactiva generada automáticamente con springdoc-openapi. Permite probar endpoints con autenticación JWT integrada.

## 🔗 Referencias

- [README raíz](../../README.md) - Para ejecutar el stack completo con Docker
- [Frontend README](../../frontend/flowboard-ui/README.md) - Para integración frontend-backend
- [docker-compose.yml](../../docker-compose.yml) - Configuración de contenedores
