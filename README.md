# DevPanel — Jason

Mini panel de administración: login con sesión persistente, dashboard con métricas y una tabla de usuarios con búsqueda con debounce.

**Stack:** Angular 21 (standalone components, signals) + Spring Boot 3 (Java 21, Spring Security, JWT) + PostgreSQL 16. Elegí este stack porque es el que domino a diario en mi trabajo (Java/Spring Boot en backend), y separar frontend/backend me deja mostrar mejor las capas típicas de una API productiva (handler → service → repository) en 2 horas.

## Prerrequisitos

- Node.js 20+ y npm
- Java 21 (JDK)
- Maven 3.9+ (o usa el wrapper si lo agregas)
- Docker + Docker Compose (para Postgres) — o un Postgres local propio

## 1. Levantar Postgres

```bash
cp .env.example .env
docker compose up -d
```

Esto crea la base `devpanel` con usuario/clave `devpanel`/`devpanel` en `localhost:5432`.

Si prefieres un Postgres que ya tengas corriendo, solo actualiza `DB_*` en `.env` / `backend/src/main/resources/application.yml`.

## 2. Levantar el backend

```bash
cd backend
export $(cat ../.env | xargs)   # o exporta las variables a mano en tu shell/IDE
.\gradlew.bat bootRun
```

La API queda en `http://localhost:8080`. Al iniciar por primera vez (tabla `app_user` vacía), `DataSeeder` crea automáticamente:

- 2 usuarios de login de referencia (ver credenciales abajo)
- 40 usuarios de prueba adicionales (para que la tabla, búsqueda y paginación tengan datos reales)

No hay usuarios hardcodeados en un JSON: todo vive en Postgres, insertado vía JPA/Hibernate con password hasheado (BCrypt).

## 3. Levantar el frontend

```bash
cd frontend
npm install
npm start
```

La app queda en `http://localhost:4200` y apunta a `http://localhost:8080/api` (ver `src/environments/environment.development.ts`).

## Credenciales de prueba

| Email                  | Password    | Rol   |
|-------------------------|-------------|-------|
| admin@devpanel.local     | Admin123!   | ADMIN |
| user@devpanel.local      | User123!    | USER  |

## Decisiones técnicas clave

- **JWT stateless** (`spring-security` + `jjwt`) en vez de sesiones de servidor: el token se guarda en `localStorage` en el frontend y sobrevive a un reload; un `AuthInterceptor` lo adjunta a cada request y, si el backend responde `401` (token vencido/ inválido), fuerza logout + redirect a `/login` sin que el usuario vea una pantalla rota.
- **Seed vía código (`DataSeeder`), no `data.sql` ni JSON**: los passwords se generan con el mismo `PasswordEncoder` (BCrypt) que usa el login real, así que el seed pasa por el mismo camino de código que la app en producción usaría.
- **Búsqueda con debounce real**: `searchControl.valueChanges` con `debounceTime(300) + distinctUntilChanged() + switchMap`, para no golpear el backend en cada tecla ni dejar requests obsoletas en carrera.
- **Paginación server-side** (`Pageable` de Spring Data) en vez de traer todo y paginar en el cliente, para que la tabla escale más allá de los 40 usuarios de seed.

## Limitaciones conocidas (lo que NO está hecho)

- No hay registro de usuarios (signup) — solo login, por prioridad de tiempo (P0 no lo pedía).
- No hay filtros por rol/estado (P2, quedó fuera).
- No hay tests automatizados (unit/integration) — se priorizó tener el flujo end-to-end funcionando dentro de las 2h.
- El `ddl-auto: update` de Hibernate es aceptable para este ejercicio; en un proyecto real usaría migraciones versionadas (Flyway/Liquibase).
- No se implementó refresh token: el JWT expira a la hora (`JWT_EXPIRATION_MS`) y el usuario debe volver a iniciar sesión.

## Estructura del repo

```
devpanel-jason/
├── backend/            # Spring Boot (Java 21)
├── frontend/           # Angular 21
├── migrations/         # Postgres 18
├── docker-compose.yml  # Postgres local
├── README.md
├── AI-LOG.md
└── .env.example
```
