# Flowboard Frontend

## Descripción

Interfaz de usuario moderna construida con React 18, Vite 5 y Material UI v6 que consume la API REST de FlowBoard. Ofrece un flujo de autenticación completo, dashboard con métricas en tiempo real, gestión de procesos con filtros avanzados, y un sistema de notificaciones con estado de lectura y timestamps relativos.

La experiencia de usuario incluye validación de contraseñas en tiempo real conforme a estándares NIST mediante el componente `PasswordStrengthChecker`, que guía al usuario con feedback visual inmediato antes de enviar datos al backend. El diseño es completamente responsive, accesible y optimizado.

## Tecnologías

- React 18, Vite 5, React Router 6
- Material UI v6, Emotion, React Icons
- Axios (con interceptors JWT), Context API
- Recharts
- ESLint + Prettier
- Vite

## Ejecución

### Opción - Desarrollo Local:

```bash
# Requisitos: Node.js 20+, npm/pnpm

# 1. Clonar repositorio y configurar variables
git clone https://github.com/abril-ruiz/flowboard-app.git
cd flowboard-app
cp .env.example .env
# Verificar que VITE_API_URL apunte a tu backend

# 2. Entrar al frontend
cd frontend/flowboard-ui

# 3. Instalar dependencias
npm install

# 4. Ejecutar en modo desarrollo
npm run dev

# 5. Acceder
🖥️ App: http://localhost:5173
```

### Opción - Docker

```bash
# Desde la raíz del proyecto:
docker compose up --build frontend
```

🔗 Ver [README raíz](../../README.md) para levantar todo el stack.

## Estructura del proyecto

```
src/
├── api/
│   ├── notificationApi.js     # Funciones para obtener notificaciones del usuario y marcarlas como leídas
│   ├── processApi.js          # Funciones para CRUD de procesos: filtrado, creación, actualización de estado, etc.
│   └── client.js              # Cliente Axios configurado con interceptors JWT
│
├── context/
│   └── AuthContext.jsx        # Estado global de autenticación (user, login, logout)
│
├── components/
│   ├── Navbar.jsx             # Barra de navegación con menú de usuario y notificaciones
│   ├── Layout.jsx             # Contenedor que aplica Navbar a rutas protegidas
│   ├── PassswordStrengthChecker.jsx  # Componente visual de validación NIST
│   └── ProcessVolumeChart.jsx        # Gráfico de línea con Recharts para visualizar volumen mensual de procesos
│
├── pages/
│   ├── Login.jsx              # Pantalla de autenticación con validación visual
│   ├── Register.jsx           # Registro de nuevos usuarios
│   ├── Dashboard.jsx          # Vista principal con KPIs y gráficos
│   ├── ProcessList.jsx        # Tabla de procesos con filtros y paginación
│   ├── ProcessDetail.jsx      # Vista de detalle con comentarios y cambio de estado
│   └── Profile.jsx            # Configuración de perfil y cambio de contraseña
│
├── utils/
│   ├── passwordValidation.js  # Validación centralizada de contraseñas NIST
│   └── timeAgo.js             # Helper para formatos de tiempo relativos ("Hace 5 min")
│
├── App.jsx                    # Configuración de rutas + protección con <PrivateRoute>
└── main.jsx                   # Punto de entrada React + inyección de tema MUI
```

## Funcionalidades

- Autenticación con interceptor Axios que inyecta automáticamente el token JWT en cada request
- Rutas protegidas con componente <PrivateRoute> que redirige a /login si no hay sesión activa
- Validación de contraseñas en tiempo real con componente PasswordStrengthChecker conforme a estándares NIST
- Sistema de notificaciones con badge dinámico, dropdown con límite de 3 items y página de historial completo
- Diseño responsive con sistema de Grid de MUI y breakpoints adaptativos para móvil/tablet/desktop
- Dashboard con gráficos interactivos usando Recharts (barras, KPIs con colores dinámicos)
  Tabla de procesos con DataGrid de MUI: paginación, ordenamiento, filtros por estado y badges de colores
- Manejo de errores con alertas visuales y mensajes específicos por tipo de fallo
- Navbar fija con menú de usuario desplegable, icono de notificaciones y navegación contextual

## 🔗 Referencias

- [README raíz](../../README.md) - Para ejecutar el stack completo con Docker
- [Backend README](../../backend/flowboard/README.md) - Para documentación de API y endpoints
- [docker-compose.yml](../../docker-compose.yml) - Configuración de contenedores
