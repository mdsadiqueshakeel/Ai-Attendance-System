# Smart Attendance Backend (Phase 1)

Spring Boot backend for a Smart Attendance System.

Phase 1 scope:
- JWT auth (ADMIN/STUDENT)
- Student management + face image upload (store path in DB)
- Manual attendance marking + reports
- PostgreSQL via JPA/Hibernate

## Run

1. Set environment variables:
   - `DB_URL` (JDBC URL)
   - `DB_USERNAME`
   - `DB_PASSWORD`
   - `JWT_SECRET`

2. Start:
   - `mvn spring-boot:run`

Swagger UI (when running):
- `/swagger-ui.html`

