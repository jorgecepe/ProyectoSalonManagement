# 💇 Sistema de Gestión de Peluquería

Sistema completo de gestión para peluquerías y salones de belleza. Permite a los clientes agendar citas online y al personal gestionar servicios, clientes y horarios.

**Proyecto de aprendizaje:** PostgreSQL + Node.js + Express + React

---

## 🎯 Objetivos del Proyecto

Este proyecto fue creado como parte de un programa de aprendizaje de 30 días para dominar:

- ✅ PostgreSQL (diseño de BD, queries avanzadas, optimización)
- ✅ Node.js + Express (API REST, autenticación, buenas prácticas)
- ✅ React (componentes, hooks, estado global, integración con APIs)
- ✅ Docker (containerización, docker-compose, deployment)
- ✅ Git/GitHub (versionamiento, colaboración, buenas prácticas)

---

## 🚀 Features

### 📅 Sistema de Citas
- Agendar citas online
- Ver disponibilidad en tiempo real
- Confirmación y recordatorios
- Historial de citas

### 👥 Gestión de Clientes
- Base de datos de clientes
- Historial de servicios
- Notas y preferencias
- Búsqueda rápida

### 💼 Gestión de Personal
- Horarios de trabajo
- Asignación de citas
- Estadísticas de desempeño
- Roles y permisos

### 💈 Servicios
- Catálogo de servicios
- Precios y duraciones
- Servicios combinables
- Gestión de inventario (próximamente)

### 📊 Dashboard
- Estadísticas en tiempo real
- Citas del día/semana/mes
- Ingresos y métricas
- Reportes personalizados

---

## 🛠️ Stack Tecnológico

### Backend
- **Node.js** v18+
- **Express.js** - Framework web
- **PostgreSQL** - Base de datos (via Supabase)
- **pg** - PostgreSQL client para Node.js
- **dotenv** - Variables de entorno

### Frontend (Semana 2+)
- **React** v18+
- **Vite** - Build tool
- **Axios** - HTTP client
- **React Router** - Navegación
- **TailwindCSS** - Estilos (próximamente)

### DevOps (Semana 3+)
- **Docker** - Containerización
- **Docker Compose** - Orquestación
- **GitHub Actions** - CI/CD (próximamente)

### Hosting
- **Supabase** - Base de datos PostgreSQL
- **Vercel/Netlify** - Frontend (próximamente)
- **Railway/Render** - Backend API (próximamente)

---

## 📦 Instalación y Setup

### Prerrequisitos
- Node.js 18+ instalado
- Git instalado
- Cuenta en Supabase (gratis)
- Cuenta en GitHub

### Setup Completo

Sigue la guía detallada en [`SETUP-GUIDE.md`](./SETUP-GUIDE.md)

**Resumen rápido:**

```bash
# 1. Clonar repositorio
git clone https://github.com/TU_USUARIO/salon-management.git
cd salon-management

# 2. Configurar variables de entorno
cp .env.example .env
# Edita .env con tus credenciales de Supabase

# 3. Instalar dependencias del backend
cd backend
npm install

# 4. Ejecutar migraciones en Supabase
# Ve a Supabase SQL Editor y ejecuta:
# - database/01-schema.sql
# - database/02-seed-data.sql

# 5. Iniciar servidor de desarrollo
npm run dev

# 6. Verificar en el navegador
# http://localhost:3000 - API base
# http://localhost:3000/api/health - Health check
```

---

## 📁 Estructura del Proyecto

```
salon-management/
│
├── database/                    # Scripts SQL
│   ├── 01-schema.sql           # Estructura de tablas
│   ├── 02-seed-data.sql        # Datos de ejemplo
│   └── README.md
│
├── backend/                     # API Node.js + Express
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js     # Configuración de PostgreSQL
│   │   ├── routes/
│   │   │   ├── clients.js      # Rutas de clientes
│   │   │   ├── services.js     # Rutas de servicios
│   │   │   ├── staff.js        # Rutas de personal
│   │   │   └── appointments.js # Rutas de citas
│   │   ├── controllers/
│   │   │   └── ...             # Lógica de negocio
│   │   └── server.js           # Servidor principal
│   ├── package.json
│   └── .env                    # Variables de entorno (no subir a git)
│
├── frontend/                    # App React (Semana 2+)
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── hooks/
│   │   └── App.jsx
│   └── package.json
│
├── docker/                      # Configuración Docker (Semana 3+)
│   ├── Dockerfile.backend
│   ├── Dockerfile.frontend
│   └── docker-compose.yml
│
├── docs/                        # Documentación
│   ├── API.md                  # Documentación de API
│   └── DATABASE.md             # Esquema de base de datos
│
├── .gitignore
├── .env.example                # Plantilla de variables de entorno
├── README.md                   # Este archivo
└── SETUP-GUIDE.md             # Guía detallada de setup
```

---

## 🔐 Seguridad

**IMPORTANTE:** Este proyecto es para aprendizaje. Para producción:

- [ ] Implementar autenticación real (JWT, OAuth)
- [ ] Hashear contraseñas con bcrypt
- [ ] Validar todas las entradas con Joi/Zod
- [ ] Implementar rate limiting
- [ ] Usar HTTPS en producción
- [ ] Variables de entorno seguras
- [ ] Auditoría de dependencias (npm audit)

---

## 📚 Documentación

- [Setup Guide](./SETUP-GUIDE.md) - Guía de instalación paso a paso
- [API Documentation](./docs/API.md) - Endpoints y ejemplos (próximamente)
- [Database Schema](./docs/DATABASE.md) - Estructura de BD (próximamente)

---

## 🗓️ Roadmap

### ✅ Fase 1: Backend Base (Días 1-7)
- [x] Diseño de base de datos
- [x] Setup con Supabase
- [x] Servidor Express básico
- [x] Conexión a PostgreSQL
- [ ] CRUD de clientes
- [ ] CRUD de servicios
- [ ] CRUD de staff
- [ ] Sistema de citas
- [ ] Validación de disponibilidad

### 🚧 Fase 2: Frontend React (Días 8-14)
- [ ] Setup de React con Vite
- [ ] Componentes base
- [ ] Integración con API
- [ ] Formularios de reserva
- [ ] Calendario de citas
- [ ] Dashboard de estadísticas

### ⏳ Fase 3: Full Stack + Docker (Días 15-21)
- [ ] Autenticación JWT
- [ ] Roles y permisos
- [ ] Dockerización completa
- [ ] Deploy a producción
- [ ] CI/CD con GitHub Actions

### 💡 Fase 4: Features Avanzadas (Días 22-30)
- [ ] Notificaciones por email/SMS
- [ ] Integración de pagos (Stripe)
- [ ] WebSockets para disponibilidad en tiempo real
- [ ] Sistema de recordatorios automáticos
- [ ] App móvil (React Native) - futuro

---

## 🧪 Testing

```bash
# Ejecutar tests (próximamente)
npm test

# Coverage
npm run test:coverage
```

---

## 🤝 Contribución

Este es un proyecto de aprendizaje personal, pero las sugerencias son bienvenidas:

1. Fork del proyecto
2. Crea tu rama (`git checkout -b feature/AmazingFeature`)
3. Commit de cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Licencia

Este proyecto es de código abierto bajo licencia MIT. Ver `LICENSE` para más detalles.

---

## 👤 Autor

**Tu Nombre**
- GitHub: [@tu-usuario](https://github.com/tu-usuario)
- LinkedIn: [tu-perfil](https://linkedin.com/in/tu-perfil)

---

## 🙏 Agradecimientos

- Proyecto inspirado en sistemas reales de gestión de salones
- Agradecimiento especial a la comunidad de PostgreSQL y React
- Supabase por su excelente servicio gratuito

---

## 📊 Estado del Proyecto

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)
![Coverage](https://img.shields.io/badge/coverage-0%25-red)
![Version](https://img.shields.io/badge/version-0.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)

**Última actualización:** Noviembre 2025

---

## 🎓 Aprendizajes Clave

Durante el desarrollo de este proyecto aprenderás:

1. **Diseño de Bases de Datos**
   - Normalización (3NF)
   - Relaciones complejas
   - Índices y optimización
   - Triggers y funciones

2. **Backend Development**
   - API RESTful design
   - Autenticación y autorización
   - Validación de datos
   - Manejo de errores

3. **Frontend Development**
   - Componentes reutilizables
   - Estado global
   - Integración con APIs
   - UX/UI patterns

4. **DevOps**
   - Containerización
   - CI/CD pipelines
   - Deployment strategies
   - Monitoring y logs

---

¿Listo para empezar? 🚀 Sigue el [SETUP-GUIDE.md](./SETUP-GUIDE.md)